/**
 * Rasterise the SoftBase brand mark to HD PNGs (2048x2048, 1:1).
 * Geometry mirrors public/favicon.svg: 32x32 grid, three signal bars
 * (x=6, widths 20/14/9, height 3) on a dark tile with 4-unit radius.
 *
 * Usage: node scripts/export-logo.mjs
 * Output: brand/softbase-logo.png (dark tile) and
 *         brand/softbase-logo-transparent.png (mark only)
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const SIZE = 2048;
const SS = 2; // supersample factor; all geometry lands on integer boundaries
const N = SIZE * SS;
const S = N / 32;

const ORANGE = [255, 59, 20];
const DARK = [11, 11, 12];

function insideRoundedTile(x, y) {
  // 32x32 tile, radius 4, coordinates in pixels (already scaled)
  const r = 4 * S;
  const nx = Math.min(Math.max(x, r), N - r);
  const ny = Math.min(Math.max(y, r), N - r);
  const dx = x - nx;
  const dy = y - ny;
  return dx * dx + dy * dy <= r * r;
}

function insideBar(x, y) {
  const x0 = 6 * S;
  const y0s = [8 * S, 14.5 * S, 21 * S];
  const widths = [20 * S, 14 * S, 9 * S];
  const h = 3 * S;
  if (x < x0 || x >= x0 + 20 * S || y < y0s[0] || y >= y0s[2] + h) return false;
  for (let i = 0; i < 3; i++) {
    if (y >= y0s[i] && y < y0s[i] + h && x >= x0 && x < x0 + widths[i]) return true;
  }
  return false;
}

function rasterise(withBg) {
  // sample at supersampled pixel CENTRES, average SS*SS block -> one pixel
  const out = Buffer.alloc(SIZE * SIZE * 4);
  for (let py = 0; py < SIZE; py++) {
    for (let px = 0; px < SIZE; px++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = (px + (sx + 0.5) / SS) * SS;
          const y = (py + (sy + 0.5) / SS) * SS;
          let cr = 0;
          let cg = 0;
          let cb = 0;
          let ca = 0;
          if (insideBar(x, y)) {
            [cr, cg, cb] = ORANGE;
            ca = 255;
          } else if (withBg && insideRoundedTile(x, y)) {
            [cr, cg, cb] = DARK;
            ca = 255;
          }
          // straight average over samples (premultiplied accumulate)
          r += cr * ca;
          g += cg * ca;
          b += cb * ca;
          a += ca;
        }
      }
      const samples = SS * SS;
      const o = (py * SIZE + px) * 4;
      if (a === 0) {
        out[o] = out[o + 1] = out[o + 2] = out[o + 3] = 0;
      } else {
        out[o] = Math.round(r / a);
        out[o + 1] = Math.round(g / a);
        out[o + 2] = Math.round(b / a);
        out[o + 3] = Math.round(a / samples);
      }
    }
  }
  return out;
}

/* ---- minimal PNG encoder (RGBA8, no filtering) ---- */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

function encodePng(rgba, size) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync('brand', { recursive: true });
writeFileSync('brand/softbase-logo.png', encodePng(rasterise(true), SIZE));
writeFileSync('brand/softbase-logo-transparent.png', encodePng(rasterise(false), SIZE));
console.log('wrote brand/softbase-logo.png and brand/softbase-logo-transparent.png at', SIZE, 'px');
