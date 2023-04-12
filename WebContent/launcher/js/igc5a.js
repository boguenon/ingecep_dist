/*
amplixbi.com on MPLIX project
Copyright(c) 2011 amplixbi.com
http://www.amplixbi.com/
*/
/*
This file is part of INGECEP

Copyright (c) 2011-2013 INGECEP Inc

Contact:  http://www.ingecep.com/contact

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.ingecep.com/contact.

*/
// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);

// (public) Constructor
function BigInteger(a,b,c) {
  if(a != null)
    if("number" == typeof a) this.fromNumber(a,b,c);
    else if(b == null && "string" != typeof a) this.fromString(a,256);
    else this.fromString(a,b);
}

// return new, unset BigInteger
function nbi() { return new BigInteger(null); }

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i,x,w,j,c,n) {
  while(--n >= 0) {
    var v = x*this[i++]+w[j]+c;
    c = Math.floor(v/0x4000000);
    w[j++] = v&0x3ffffff;
  }
  return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i,x,w,j,c,n) {
  var xl = x&0x7fff, xh = x>>15;
  while(--n >= 0) {
    var l = this[i]&0x7fff;
    var h = this[i++]>>15;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
    w[j++] = l&0x3fffffff;
  }
  return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i,x,w,j,c,n) {
  var xl = x&0x3fff, xh = x>>14;
  while(--n >= 0) {
    var l = this[i]&0x3fff;
    var h = this[i++]>>14;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x3fff)<<14)+w[j]+c;
    c = (l>>28)+(m>>14)+xh*h;
    w[j++] = l&0xfffffff;
  }
  return c;
}
if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
  BigInteger.prototype.am = am2;
  dbits = 30;
}
else if(j_lm && (navigator.appName != "Netscape")) {
  BigInteger.prototype.am = am1;
  dbits = 26;
}
else { // Mozilla/Netscape seems to prefer am3
  BigInteger.prototype.am = am3;
  dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) { return BI_RM.charAt(n); }
function intAt(s,i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c==null)?-1:c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
  r.t = this.t;
  r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1;
  this.s = (x<0)?-1:0;
  if(x > 0) this[0] = x;
  else if(x < -1) this[0] = x+DV;
  else this.t = 0;
}

// return bigint initialized to value
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

// (protected) set from string and radix
function bnpFromString(s,b) {
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 256) k = 8; // byte array
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else { this.fromRadix(s,b); return; }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while(--i >= 0) {
    var x = (k==8)?s[i]&0xff:intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if(sh == 0)
      this[this.t++] = x;
    else if(sh+k > this.DB) {
      this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
      this[this.t++] = (x>>(this.DB-sh));
    }
    else
      this[this.t-1] |= x<<sh;
    sh += k;
    if(sh >= this.DB) sh -= this.DB;
  }
  if(k == 8 && (s[0]&0x80) != 0) {
    this.s = -1;
    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
  }
  this.clamp();
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s&this.DM;
  while(this.t > 0 && this[this.t-1] == c) --this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
  if(this.s < 0) return "-"+this.negate().toString(b);
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
  var p = this.DB-(i*this.DB)%k;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
    while(i >= 0) {
      if(p < k) {
        d = (this[i]&((1<<p)-1))<<(k-p);
        d |= this[--i]>>(p+=this.DB-k);
      }
      else {
        d = (this[i]>>(p-=k))&km;
        if(p <= 0) { p += this.DB; --i; }
      }
      if(d > 0) m = true;
      if(m) r += int2char(d);
    }
  }
  return m?r:"0";
}

// (public) -this
function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

// (public) |this|
function bnAbs() { return (this.s<0)?this.negate():this; }

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s-a.s;
  if(r != 0) return r;
  var i = this.t;
  r = i-a.t;
  if(r != 0) return r;
  while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
  return 0;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1, t;
  if((t=x>>>16) != 0) { x = t; r += 16; }
  if((t=x>>8) != 0) { x = t; r += 8; }
  if((t=x>>4) != 0) { x = t; r += 4; }
  if((t=x>>2) != 0) { x = t; r += 2; }
  if((t=x>>1) != 0) { x = t; r += 1; }
  return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if(this.t <= 0) return 0;
  return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n,r) {
  var i;
  for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
  for(i = n-1; i >= 0; --i) r[i] = 0;
  r.t = this.t+n;
  r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n,r) {
  for(var i = n; i < this.t; ++i) r[i-n] = this[i];
  r.t = Math.max(this.t-n,0);
  r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n,r) {
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<cbs)-1;
  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
  for(i = this.t-1; i >= 0; --i) {
    r[i+ds+1] = (this[i]>>cbs)|c;
    c = (this[i]&bm)<<bs;
  }
  for(i = ds-1; i >= 0; --i) r[i] = 0;
  r[ds] = c;
  r.t = this.t+ds+1;
  r.s = this.s;
  r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n,r) {
  r.s = this.s;
  var ds = Math.floor(n/this.DB);
  if(ds >= this.t) { r.t = 0; return; }
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<bs)-1;
  r[0] = this[ds]>>bs;
  for(var i = ds+1; i < this.t; ++i) {
    r[i-ds-1] |= (this[i]&bm)<<cbs;
    r[i-ds] = this[i]>>bs;
  }
  if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
  r.t = this.t-ds;
  r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]-a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c -= a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c -= a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c<0)?-1:0;
  if(c < -1) r[i++] = this.DV+c;
  else if(c > 0) r[i++] = c;
  r.t = i;
  r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a,r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i+y.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
  r.s = 0;
  r.clamp();
  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs();
  var i = r.t = 2*x.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < x.t-1; ++i) {
    var c = x.am(i,x[i],r,2*i,0,1);
    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
      r[i+x.t] -= x.DV;
      r[i+x.t+1] = 1;
    }
  }
  if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
  r.s = 0;
  r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m,q,r) {
  var pm = m.abs();
  if(pm.t <= 0) return;
  var pt = this.abs();
  if(pt.t < pm.t) {
    if(q != null) q.fromInt(0);
    if(r != null) this.copyTo(r);
    return;
  }
  if(r == null) r = nbi();
  var y = nbi(), ts = this.s, ms = m.s;
  var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
  else { pm.copyTo(y); pt.copyTo(r); }
  var ys = y.t;
  var y0 = y[ys-1];
  if(y0 == 0) return;
  var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
  var i = r.t, j = i-ys, t = (q==null)?nbi():q;
  y.dlShiftTo(j,t);
  if(r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t,r);
  }
  BigInteger.ONE.dlShiftTo(ys,t);
  t.subTo(y,y);	// "negative" y so we can replace sub with am later
  while(y.t < ys) y[y.t++] = 0;
  while(--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
      y.dlShiftTo(j,t);
      r.subTo(t,r);
      while(r[i] < --qd) r.subTo(t,r);
    }
  }
  if(q != null) {
    r.drShiftTo(ys,q);
    if(ts != ms) BigInteger.ZERO.subTo(q,q);
  }
  r.t = ys;
  r.clamp();
  if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
  if(ts < 0) BigInteger.ZERO.subTo(r,r);
}

// (public) this mod a
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a,null,r);
  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
  return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) { this.m = m; }
function cConvert(x) {
  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
}
function cRevert(x) { return x; }
function cReduce(x) { x.divRemTo(this.m,null,x); }
function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if(this.t < 1) return 0;
  var x = this[0];
  if((x&1) == 0) return 0;
  var y = x&3;		// y == 1/x mod 2^2
  y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
  y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y>0)?this.DV-y:-y;
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp&0x7fff;
  this.mph = this.mp>>15;
  this.um = (1<<(m.DB-15))-1;
  this.mt2 = 2*m.t;
}

// xR mod m
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t,r);
  r.divRemTo(this.m,null,r);
  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
  return r;
}

// x/R mod m
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while(x.t <= this.mt2)	// pad x so am has enough room later
    x[x.t++] = 0;
  for(var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i]&0x7fff;
    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i+this.m.t;
    x[j] += this.m.am(0,u0,x,i,0,this.m.t);
    // propagate carry
    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
  }
  x.clamp();
  x.drShiftTo(this.m.t,x);
  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = "xy/R mod m"; x,y != r
function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e,z) {
  if(e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
  g.copyTo(r);
  while(--i >= 0) {
    z.sqrTo(r,r2);
    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
    else { var t = r; r = r2; r2 = t; }
  }
  return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e,m) {
  var z;
  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
  return this.exp(e,z);
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

// Depends on jsbn.js and rng.js

// Version 1.1: support utf-8 encoding in pkcs1pad2

// convert a (hex) string to a bignum object
function parseBigInt(str,r) {
  return new BigInteger(str,r);
}

function linebrk(s,n) {
  var ret = "";
  var i = 0;
  while(i + n < s.length) {
    ret += s.substring(i,i+n) + "\n";
    i += n;
  }
  return ret + s.substring(i,s.length);
}

function byte2Hex(b) {
  if(b < 0x10)
    return "0" + b.toString(16);
  else
    return b.toString(16);
}

// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s,n) {
  if(n < s.length + 11) { // TODO: fix for utf-8
    alert("Message too long for RSA");
    return null;
  }
  var ba = new Array();
  var i = s.length - 1;
  while(i >= 0 && n > 0) {
    var c = s.charCodeAt(i--);
    
    if(c < 128) { // encode using utf-8
      ba[--n] = c;
    }
    else if((c > 127) && (c < 2048)) {
      ba[--n] = (c & 63) | 128;
      ba[--n] = (c >> 6) | 192;
    }
    else {
      ba[--n] = (c & 63) | 128;
      ba[--n] = ((c >> 6) & 63) | 128;
      ba[--n] = (c >> 12) | 224;
    }
  }
  ba[--n] = 0;
  var rng = new SecureRandom();
  var x = new Array();
  while(n > 2) { // random non-zero pad
    x[0] = 0;
    while(x[0] == 0) rng.nextBytes(x);
    ba[--n] = x[0];
  }
  ba[--n] = 2;
  ba[--n] = 0;
  return new BigInteger(ba);
}

// "empty" RSA key constructor
function RSAKey() {
  this.n = null;
  this.e = 0;
  this.d = null;
  this.p = null;
  this.q = null;
  this.dmp1 = null;
  this.dmq1 = null;
  this.coeff = null;
}

// Set the public key fields N and e from hex strings
function RSASetPublic(N,E) {
  if(N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = parseBigInt(N,16);
    this.e = parseInt(E,16);
  }
  else
    alert("Invalid RSA public key");
}

// Perform raw public operation on "x": return x^e (mod n)
function RSADoPublic(x) {
  return x.modPowInt(this.e, this.n);
}

// Return the PKCS#1 RSA encryption of "text" as an even-length hex string
function RSAEncrypt(text) {
  var m = pkcs1pad2(text,(this.n.bitLength()+7)>>3);
  if(m == null) return null;
  var c = this.doPublic(m);
  if(c == null) return null;
  var h = c.toString(16);
  if((h.length & 1) == 0) return h; else return "0" + h;
}

// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
//function RSAEncryptB64(text) {
//  var h = this.encrypt(text);
//  if(h) return hex2b64(h); else return null;
//}

// protected
RSAKey.prototype.doPublic = RSADoPublic;

// public
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.encrypt = RSAEncrypt;
//RSAKey.prototype.encrypt_b64 = RSAEncryptB64;

// prng4.js - uses Arcfour as a PRNG

function Arcfour() {
  this.i = 0;
  this.j = 0;
  this.S = new Array();
}

// Initialize arcfour context from key, an array of ints, each from [0..255]
function ARC4init(key) {
  var i, j, t;
  for(i = 0; i < 256; ++i)
    this.S[i] = i;
  j = 0;
  for(i = 0; i < 256; ++i) {
    j = (j + this.S[i] + key[i % key.length]) & 255;
    t = this.S[i];
    this.S[i] = this.S[j];
    this.S[j] = t;
  }
  this.i = 0;
  this.j = 0;
}

function ARC4next() {
  var t;
  this.i = (this.i + 1) & 255;
  this.j = (this.j + this.S[this.i]) & 255;
  t = this.S[this.i];
  this.S[this.i] = this.S[this.j];
  this.S[this.j] = t;
  return this.S[(t + this.S[this.i]) & 255];
}

Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;

// Plug in your RNG constructor here
function prng_newstate() {
  return new Arcfour();
}

// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;

// Random number generator - requires a PRNG backend, e.g. prng4.js

// For best results, put code like
// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
// in your main HTML document.

var rng_state;
var rng_pool;
var rng_pptr;

// Mix in a 32-bit integer into the pool
function rng_seed_int(x) {
  rng_pool[rng_pptr++] ^= x & 255;
  rng_pool[rng_pptr++] ^= (x >> 8) & 255;
  rng_pool[rng_pptr++] ^= (x >> 16) & 255;
  rng_pool[rng_pptr++] ^= (x >> 24) & 255;
  if(rng_pptr >= rng_psize) rng_pptr -= rng_psize;
}

// Mix in the current time (w/milliseconds) into the pool
function rng_seed_time() {
  rng_seed_int(new Date().getTime());
}

// Initialize the pool with junk if needed.
if(rng_pool == null) {
  rng_pool = new Array();
  rng_pptr = 0;
  var t;
  if(navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
    // Extract entropy (256 bits) from NS4 RNG if available
    var z = window.crypto.random(32);
    for(t = 0; t < z.length; ++t)
      rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
  }  
  while(rng_pptr < rng_psize) {  // extract some randomness from Math.random()
    t = Math.floor(65536 * Math.random());
    rng_pool[rng_pptr++] = t >>> 8;
    rng_pool[rng_pptr++] = t & 255;
  }
  rng_pptr = 0;
  rng_seed_time();
  //rng_seed_int(window.screenX);
  //rng_seed_int(window.screenY);
}

function rng_get_byte() {
  if(rng_state == null) {
    rng_seed_time();
    rng_state = prng_newstate();
    rng_state.init(rng_pool);
    for(rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
      rng_pool[rng_pptr] = 0;
    rng_pptr = 0;
    //rng_pool = null;
  }
  // TODO: allow reseeding after first request
  return rng_state.next();
}

function rng_get_bytes(ba) {
  var i;
  for(i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
}

function SecureRandom() {}

SecureRandom.prototype.nextBytes = rng_get_bytes;

var Base64 = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		if (!input)
			return "";
			
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		
		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 	},
 	
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}
if (!window.IG$/*mainapp*/)
{
	window.IG$/*mainapp*/ = {};
}

IG$/*mainapp*/._cc2/*isandroid*/ = false;

if (navigator.userAgent.indexOf("Android") > -1)
{
	IG$/*mainapp*/._cc2/*isandroid*/ = true;
}

$.cookie = function(name, value, options) {
	// for android
	
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        
        if (IG$/*mainapp*/._cc2/*isandroid*/ == true)
        {
        	if (window.openDatabase)
			{
				var shortName = 'INGECEP';
				var version = '1.0';
				var displayName = 'INGECEP Web Mobile Database';
				var maxSize = 5000000; // 5Mbytes
				
				INGECEP = openDatabase(shortName, version, displayName, maxSize);
				
				var reqdb = this;
		
				INGECEP.transaction (
					function (transaction)
					{
						transaction.instance = this;
						// transaction.executeSql('DROP TABLE metacache');
						transaction.executeSql('CREATE TABLE IF NOT EXISTS metacache (source_id TEXT, name TEXT, value TEXT);', [], function(transaction) {
							
						});
					}
				);
				
				INGECEP.transaction (
					function (transaction)
					{
						transaction.executeSql('DELETE FROM metacache WHERE source_id=? AND name=?', ['cookie', 'cookie']);
					}
				);
				
				INGECEP.transaction (
					function (transaction)
					{
						transaction.executeSql('INSERT INTO metacache (source_id, name, value) VALUES (?, ?, ?)', ['cookie', 'cookie', document.cookie]);
					}
				);
			}
        }
    } else { // only name given, get cookie
        var cookieValue = null;
        // alert(">> " + document.cookie);
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            
            for (var i = 0; i < cookies.length; i++) {
                var cookie = $.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
	    
        return cookieValue;
    }
};

IG$/*mainapp*/._I02/*androidcookiebug*/ = function(callback) {
	if (IG$/*mainapp*/._cc2/*isandroid*/ == true)
	{
		var shortName = 'INGECEP';
		var version = '1.0';
		var displayName = 'INGECEP Web Mobile Database';
		var maxSize = 5000000; // 5Mbytes
		
		INGECEP = openDatabase(shortName, version, displayName, maxSize);
		
		INGECEP.transaction (
			function (transaction)
			{
				transaction.executeSql('SELECT source_id, name, value FROM metacache WHERE source_id=? AND name=?', ['cookie', 'cookie'], 
					function(transaction, results) {
						var ret = "",
							i, row,
							cookieValue;
						
						if (results.rows.length > 0)
						{
							row = results.rows.item(0);
							cookieValue = row['value'];
							if (cookieValue)
							{
								// rcubeitem1=137f369-1fa7290%7CChatLogData%7CExcelLoader%7C%2F6.%EC%82%AC%EC%9A%A9%EB%B0%A9%EB%B2%95%EC%84%A4%EB%AA%85%2FChatLog%2FChatLogData; lui=admin; JSESSIONID=201FDA1BDB6F62551E361076DEF5879C; JSESSIONID=69FC325E5346F0E2A58AAB80BF528EA8
								var citems = cookieValue.split(";"),
									cobj, cname;
								for (i=citems.length-1; i>=0; i--)
								{
									cobj = citems[i].split("=");
									if (cobj.length > 0)
									{
										cname = IG$/*mainapp*/.trim12(cobj[0]).toUpperCase();
										if (cname != "LUI")
										{
											citems.splice(i, 1);
										}
									}
								}
								cookieValue = citems.join(";");
								alert(cookieValue);
								document.cookie = cookieValue;
								alert(document.cookie);
							}
						}
						
						if (callback)
						{
							callback.call();
						}
					});
			},
			function() {
				if (callback)
				{
					callback.call();
				}
			}
		);
	}
	else
	{
		if (callback)
		{
			callback.call();
		}
	}
};

(function($){
$.fn = $["fn"];

$.fn.dselect = function() {
    return this.each(function() {           
        $(this).attr('unselectable', 'on')
               .css({
                   '-moz-user-select':'none',
                   '-webkit-user-select':'none',
                   'user-select':'none'
               })
               .each(function() {
                   this.onselectstart = function() { return false; };
               });
    });
};
})(jQuery);

jQuery.fn.selText = function() {
    var obj = this[0],
    	browser = window.bowser;
    	
    if (browser.msie) {
        var range = obj.offsetParent.createTextRange();
        range.moveToElementText(obj);
        range.select();
    } else if (browser.mozilla || browser.opera) {
        var selection = obj.ownerDocument.defaultView.getSelection();
        var range = obj.ownerDocument.createRange();
        range.selectNodeContents(obj);
        selection.removeAllRanges();
        selection.addRange(range);
    } else if (browser.safari) {
        var selection = obj.ownerDocument.defaultView.getSelection();
        selection.setBaseAndExtent(obj, 0, obj, 1);
    }
    return this;
}
var gsequence = 0;

if (!window.IG$/*mainapp*/)
{
	window.IG$/*mainapp*/ = {};
}

IG$/*mainapp*/.__c_/*chartoption*/ = IG$/*mainapp*/.__c_/*chartoption*/ || {};
IG$/*mainapp*/.__c_/*chartoption*/.chartext = IG$/*mainapp*/.__c_/*chartoption*/.chartext || {};

var extjsphone = window.Ext && Ext.versions && Ext.versions.touch;

//if (typeof(Ext) != "undefined" && !extjsphone)
//{
//	Ext.ns = Ext["ns"];
//	Ext.util.Observable.on = Ext.util.Observable["on"];
//	Ext.Ajax.on = Ext.Ajax["on"];
//}

IG$/*mainapp*/._I03/*isCanvasSupported*/ = function() {
	var elem = document.createElement("canvas");
	return !!(elem.getContext && elem.getContext("2d"));	
}


IG$/*mainapp*/.UNDEFINED;
IG$/*mainapp*/.L_SPPL = null;
IG$/*mainapp*/.msgint = -1;
IG$/*mainapp*/.mX/*markInvalid*/ = "Field necessary";
IG$/*mainapp*/.level = 0;
IG$/*mainapp*/.cb/*clipboard*/ = null;
IG$/*mainapp*/.sX/*seperator*/ = "|";
IG$/*mainapp*/.i$0 = "initComponent";
IG$/*mainapp*/.msvg = window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
IG$/*mainapp*/.mcanvas = !IG$/*mainapp*/.msvg;

if (IG$/*mainapp*/.mcanvas && !IG$/*mainapp*/._I03/*isCanvasSupported*/())
{
	IG$/*mainapp*/.mcanvas = false;
}
IG$/*mainapp*/.dbp = {};
IG$/*mainapp*/.ps = {};
IG$/*mainapp*/.lE/*loadExtend*/ = {
	rcsloaded: false,
	items: []
};

IG$/*mainapp*/.extend = function(objname, base, option) {
	if (IG$/*mainapp*/.lE/*loadExtend*/.rcsloaded)
	{
		objname = IG$/*mainapp*/.x_c/*extend*/(base, option);
	}
	else
	{
		IG$/*mainapp*/.lE/*loadExtend*/.items.push({
			name: objname,
			base: base,
			option: option
		});
	}
};

IG$/*mainapp*/._rrcsv = function(t) {
	if (t && t.length > 1 && t.charAt(0) == "@")
	{
		t = IRm$/*resources*/.r1(t);
	}
	return t;
}

IG$/*mainapp*/._rrcs = function(dobj, t, span, istext) {
	if (t && t.length > 1 && t.charAt(0) == "@")
	{
		dobj._rcs = dobj._rcs || [];
		
		dobj._rcs.push({
			t: t,
			h: span,
			dobj: dobj,
			t: istext
		});
		
		t = IRm$/*resources*/.r1(t);
	}
	
	return t;
};

IG$/*mainapp*/.$lbg = function(msg, init) {
	if (init || !IG$/*mainapp*/.___mtimer)
	{
		IG$/*mainapp*/.___mtimer = new Date().getTime();
	}
	
	var ctime = new Date().getTime();
	
	console.log((ctime - IG$/*mainapp*/.___mtimer), msg);
}

IG$/*mainapp*/.override = function (target, overrides) {
    if (target.$isClass) {
        target.override(overrides);
    } else if (typeof target == "function") {
        IG$/*mainapp*/.apply(target.prototype, overrides);
    } else {
        var owner = target.self,
            name, value;

        if (owner && owner.$isClass) { // if (instance of Ext.defined class)
            for (name in overrides) {
                if (overrides.hasOwnProperty(name)) {
                    value = overrides[name];

                    if (typeof value == "function") {
                        //<debug>
                        if (owner.$className) {
                            value.displayName = owner.$className + "#" + name;
                        }
                        //</debug>

                        value.$name = name;
                        value.$owner = owner;
                        value.$previous = target.hasOwnProperty(name)
                            ? target[name] // already hooked, so call previous hook
                            : callOverrideParent; // calls by name on prototype
                    }

                    target[name] = value;
                }
            }
        } else {
            IG$/*mainapp*/.apply(target, overrides);
        }
    }

    return target;
}

IG$/*mainapp*/.x_c/*extend*/ = (function() {
    // inline overrides
    var objectConstructor = Object.prototype.constructor,
        inlineOverrides = function(o) {
        for (var m in o) {
            if (!o.hasOwnProperty(m)) {
                continue;
            }
            this[m] = o[m];
        }
    };

    return function(subclass, superclass, overrides) {
        // First we check if the user passed in just the superClass with overrides
        if (IG$/*mainapp*/.isObject(superclass)) {
            overrides = superclass;
            superclass = subclass;
            subclass = overrides.constructor !== objectConstructor ? overrides.constructor : function() {
                return superclass.apply(this, arguments);
            };
        }

        // We create a new temporary class
        var F = function() {},
            subclassProto, superclassProto = superclass.prototype;
        F.prototype = superclassProto;
        subclassProto = subclass.prototype = new F();
        subclassProto.constructor = subclass;
        subclass.superclass = superclassProto;

        if (superclassProto.constructor === objectConstructor) {
            superclassProto.constructor = superclass;
        }

        subclass.override = function(overrides) {
            IG$/*mainapp*/.override(subclass, overrides);
        };

        subclassProto.override = inlineOverrides;
        subclassProto.proto = subclassProto;

        subclass.override(overrides);
        subclass.extend = function(o) {
            return IG$/*mainapp*/.extend(subclass, o);
        };

        return subclass;
    };
}());

IG$/*mainapp*/.D_1/*microcharttype*/ = function(chartdata, opt) {
	var mctype = chartdata.mctype,
		c1 = chartdata.linecolor ? IG$/*mainapp*/.$gv/*getColorValue*/(chartdata.linecolor) : null,
		c2 = chartdata.fillcolor ? IG$/*mainapp*/.$gv/*getColorValue*/(chartdata.fillcolor) : null;
	
	switch(mctype)
	{
	case 0:
		opt.type = "bullet";
		break;
	case 2:  // area
		opt.type = "line";
		if (c1)
		{
			opt.lineColor = c1;
		}
		if (c2)
		{
			opt.fillColor = c2;
		}
		break;
	case 4:
		opt.type = "bar";
		if (c1)
		{
			opt.barColor = c1;
		}
		if (c2)
		{
			opt.negBarColor = c2;
		}
		break;
	case 6:
		opt.type = "box";
		break;
	case 7:
		opt.type = "tristate";
		if (c1)
		{
			opt.posBarColor = c1;
		}
		if (c2)
		{
			opt.negBarColor = c2;
		}
		break;
	case 8:
		opt.type = "pie";
		break;
	case 9:
		opt.type = "box";
		if (c1)
		{
			opt.boxFillColor = c1;
		}
		if (c2)
		{
			opt.medianColor = c2;
		}
		break;
	default: 
		opt.type = "line";
		if (c1)
		{
			opt.lineColor = c1;
		}
		opt.fillColor = "#fff";
		break;
	}
}

IG$/*mainapp*/.apply = function(object, config, defaults) {
    if (object && config && typeof config === "object") {
        var i, j, k;

        for (i in config) {
            object[i] = config[i];
        }
        
        var enumerables;

        if (enumerables) {
            for (j = enumerables.length; j--;) {
                k = enumerables[j];
                if (config.hasOwnProperty(k)) {
                    object[k] = config[k];
                }
            }
        }
    }

    return object;
};

IG$/*mainapp*/.copyObject = function(src) {
	var r = {}, k;
	
	for (k in src)
	{
		r[k] = src[k];
	}
	
	return r;
}

IG$/*mainapp*/.isObject = function(val) {
	if (val === null) { return false;}
	return typeof val === "object";
}

IG$/*mainapp*/.isString = function(val) {
	return typeof val === "string";
}

IG$/*mainapp*/._I04/*getMetaItemCache*/ = {
	itemicon: {},
	foldertype: {}
};

IG$/*mainapp*/._I05/*getLicenseTag*/ = function() {
	var r,
		m;
	
	if (IG$/*mainapp*/._I83/*dlgLogin*/ && IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/)
	{
		m = IG$/*mainapp*/._I83/*dlgLogin*/.jS1/*loginInfo*/.l3.substring(1);
	}
	
	if (m == "1")
	{
		r = ["COMMUNITY EDITION", "http://www.ingecep.com"];
	}
	
	// r = ["COMMUNITY EDITION", "http://www.ingecep.com"];
	
	return r;
}

IG$/*mainapp*/._I06/*formatUID*/ = function(uid) {
	if (uid && uid.indexOf("-") > -1)
	{
		var uid1 = uid.substring(0, uid.indexOf("-")),
			uid2 = uid.substring(uid.indexOf("-") + 1),
			i;
		
		if (uid1.length < 8)
		{
			for (i=uid1.length; i<8; i++)
			{
				uid1 = "0" + uid1;
			}
		}
		
		if (uid2.length < 8)
		{
			for (i=uid2.length; i<8; i++)
			{
				uid2 = "0" + uid2;
			}
		}
		
		return uid1 + "-" + uid2;
	}
	
	return uid;
}

IG$/*mainapp*/._I07/*checkUID*/ = function(uid) {
	var r = false;
	
	if (uid && uid.length == 17 && uid.charAt(8) == "-")
	{
		r = true;
	}
	
	return r;
}

IG$/*mainapp*/._I08/*formatName*/ = function(tname) {
	if (tname.length > 17 && tname.charAt(17) == "_")
	{
		tname = tname.substring(18);
	}
	else if (tname.length > 15 && tname.charAt(15) == "_")
	{
		tname = tname.substring(16);
	}
	
	return tname;
}

IG$/*mainapp*/.trim12 = function(str) {
	if (!str)
		return str;
	
	var	str = str.replace(/^\s\s*/, ""),
		ws = /\s/,
		i = str.length;
	while (ws.test(str.charAt(--i)));
	return str.slice(0, i + 1);
}

IG$/*mainapp*/._I0a/*drawLicenseTag*/ = function(unode) {
	var i,
		ltag = IG$/*mainapp*/._I05/*getLicenseTag*/(),
		PjU/*watermark*/,
		mvar;
	
	if (ltag)
	{
		PjU/*watermark*/ = $("<div></div>")
			.css({
				position: "absolute", 
				bottom: 10, left: 10, 
				backgroundImage: "url(./images/75p_white.png)",
				backgroundRepeat: "repeat",
				padding: 5
			})
			.appendTo(unode);
		for (i=0; i < ltag.length; i++)
		{
			mvar = (i>0 ? "<br>" : "");
			if (ltag[i].substring(0, 4) == "http")
			{
				mvar += "<a href='" + ltag[i] + "' target='_new'>" + ltag[i] + "</a>";
			}
			else
			{
				mvar += "<span>" + ltag[i] + "</span>";
			}
			PjU/*watermark*/.append(mvar);
		}
	}
}

IG$/*mainapp*/._I0b/*tooltip*/ = function(ui, content) {
	var t = IG$/*mainapp*/.Ti/*tooltipInstance*/;
	if (!t)
	{
		t = IG$/*mainapp*/.Ti/*tooltipInstance*/ = $("<div class='mto'></div>").css({position: "absolute", zIndex: 999}).hide();
		t.appendTo($(body));
	}
	
	t.text(text);
	t.show();
}

IG$/*mainapp*/._I0c/*typeOfValue*/ = function(value) {
    var s = typeof value;
    if (s === "object") {
        if (value) {
            if (value instanceof Array) {
                s = "array";
            }
        } else {
            s = "null";
        }
    }
    return s;
}

IG$/*mainapp*/._I0d/*findSubDivClass*/ = function(unode, cname) {
	var cdiv = null;
	if (unode.childNodes != null && unode.childNodes.length > 0)
	{
		var i;
		for (i=0; i < unode.childNodes.length; i++)
		{
			var classname = unode.childNodes[i].className;
			var cid = unode.childNodes[i].id;
			
			if ((classname && typeof(classname) == "string" && classname.indexOf(cname) > -1) || cid == cname)
			{
				return unode.childNodes[i];
			}
			
			var nodename = (unode.childNodes[i].nodeName) ? unode.childNodes[i].nodeName : unode.childNodes[i].localName;
			
			if (nodename.toLowerCase() == "div" || nodename.toLowerCase() == "span")
			{
				cdiv = IG$/*mainapp*/._I0d/*findSubDivClass*/(unode.childNodes[i], cname);
				
				if (cdiv != null)
					return cdiv;
			}
		}
	}
	
	return cdiv;
}

IG$/*mainapp*/._I0e/*isFolder*/ = function(typename) {
	var r = 5,
		cache = IG$/*mainapp*/._I04/*getMetaItemCache*/.foldertype;
		
	if (cache[typename])
	{
		r = cache[typename];
	}
	else
	{
		if (/(workspace|folder|rfolder|javapackage)/.test(typename) == true)
		{
			r = 1;
		}
		else if (/(cube|mcube|metrics|datacube|nosql|mdbcube|sqlcube)/.test(typename) == true && typename != "cubemodel")
		{
			r = 2;
		}
		else if (typename == "datemetric")
		{
			r = 3;
		}
		
		cache[typename] = r;
	}
	return r;
}

IG$/*mainapp*/._I0f/*sortTypeOrder*/ = {"workspace": 0, "folder": 1, "cube": 2, "cubemodel": 3, "javapackage": 4, "mcube": 5, "mdbcube": 6};

IG$/*mainapp*/._I10/*sortMeta*/ = function(items) {
	var torder = IG$/*mainapp*/._I0f/*sortTypeOrder*/,
		i;
	
	for (i=0; i < items.length; i++)
	{
		items[i].ltype = items[i].type.toLowerCase();
		items[i].lfd = IG$/*mainapp*/._I0e/*isFolder*/(items[i].ltype);
	}
	
	items.sort(function(a, b) {
		var c = 0,
			sa, sb,
			na = -1, nb = -1,
			al = a.lfd,
			bl = b.lfd,
			at = a.ltype,
			bt = b.ltype,
			an = a.nodepath || "",
			bn = b.nodepath || "",
			at1 = torder[at] || 99,
			bt1 = torder[bt] || 99,
			i, n, L;
			
		an = an.substring(0, an.lastIndexOf("/"));
		bn = bn.substring(0, bn.lastIndexOf("/"));
		
		if (at1 != bt1)
		{
			c = at1 - bt1;
		}
		else if (an != bn)
		{
			sa = an;
			sb = bn;
			
			if (sa.charAt(0) >= "0" && sa.charAt(0) <= "9")
			{
				na = parseInt(sa);
			}
			if (sb.charAt(0) >= "0" && sb.charAt(0) <= "9")
			{
				nb = parseInt(sb);
			}
			
			if (na > -1 && nb > -1)
			{
				c = (na - nb);
			}
			else if (na > -1)
			{
				c = 1;
			}
			else if (nb > -1)
			{
				c = -1;
			}
			else 
			{
				c = (sa > sb) ? 1 : -1;
			}
		}
		else if (al == bl && at1 == bt1)
		{
			sa = a.lname || a.name;
			sb = b.lname || b.name;
			
			rx=/(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;
			
			if(sa == sb)
			{
				c = 0;
			}
			else
			{
			    a= sa.match(rx); // sa.toLowerCase().match(rx);
			    b= sb.match(rx); // sb.toLowerCase().match(rx);
			    
			    L= a.length;
			    i= 0;
			    
			    while(i<L)
			    {
			        if(!b[i])
			        {
			        	c = 1;
			        	break;
			        }
			        
			        a1= a[i],
			        b1= b[i++];
			        if(a1!== b1)
			        {
			            n= a1-b1;
			            if(!isNaN(n)) 
			            {
			            	c = n;
			            	break;
			            }
			            
			            c = a1>b1? 1:-1;
			            break;
			        }
			    }
			    
			    if (c == 0)
			    	c = b[i]? -1:0;
			}
			
//			if (sa.charAt(0) >= "0" && sa.charAt(0) <= "9")
//			{
//				na = parseInt(sa);
//			}
//			if (sb.charAt(0) >= "0" && sb.charAt(0) <= "9")
//			{
//				nb = parseInt(sb);
//			}
//			
//			if (na > -1 && nb > -1)
//			{
//				c = (na - nb);
//			}
//			else if (na > -1)
//			{
//				c = 1;
//			}
//			else if (nb > -1)
//			{
//				c = -1;
//			}
//			else 
//			{
//				c = (sa > sb) ? 1 : -1;
//			}
		}
		else if (al == bl)
		{
			c = at1 > bt1 ? -1 : 1;
		}
		else 
		{
			c = (al > bl) ? -1 : 1;
		}
		
		return c;
	});
}

IG$/*mainapp*/._I11/*getMetaItemClass*/ = function(typename, memo) {
	var r = "",
		cache = IG$/*mainapp*/._I04/*getMetaItemCache*/.itemicon;
		
	memo = memo || "";
		
	if (cache[typename + "_" + memo])
	{
		r = cache[typename + "_" + memo];
	}
	else
	{
		switch (typename)
		{
		case "workspace":
			r = "icon-global";
			switch (memo.toLowerCase())
			{
			case "private":
				r = "icon-private";
				break;
			case "group":
				r = "icon-group";
				break;
			}
			break;
		case "metrics":
			r = "icon-folder";
			break;
		case "datacube":
			r = "icon-excel";
			break;
		default:
			r = "icon-" + typename;
			break;
		}
		
		cache[typename + "_" + memo] = r;
	}
	
	return r;
}

IG$/*mainapp*/._I12/*findSubNode*/ = function(unode, nodename, nodevalue) {
	var cdiv = null;
	if (unode.childNodes != null && unode.childNodes.length > 0)
	{
		var i;
		for (i=0; i < unode.childNodes.length; i++)
		{
			var cvalue = (unode.childNodes[i].getAttribute) ? unode.childNodes[i].getAttribute(nodename) : null;
			
			if (cvalue && cvalue == nodevalue)
			{
				return unode.childNodes[i];
			}
			
			if (unode.childNodes[i].childNodes && unode.childNodes[i].childNodes.length > 0)
			{
				cdiv = IG$/*mainapp*/._I12/*findSubNode*/(unode.childNodes[i], nodename, nodevalue);
				
				if (cdiv != null)
					return cdiv;
			}
		}
	}
	
	return cdiv;
}

/**
 * xml related
 */
IG$/*mainapp*/._I13/*loadXML*/ = function(doc) {
	/* var dindex = doc.indexOf("|");
	   var msgid = doc.substring(0, dindex);
	   doc = doc.substring(dindex+1); */
    var xdoc,
		parser;
	
    if (doc.charAt(0).charCodeAt(0) == 10)
    {
	    doc = doc.substring(1);
    }
   
	if (doc.charAt(0) != "<")
	{
		doc = Base64.decode(doc);
	}
		
	if (window.DOMParser)
	{
		parser = new DOMParser();
		xdoc = parser.parseFromString(doc, "application/xml");
	}
	else
	{
		xdoc = new ActiveXObject("Microsoft.XMLDOM");
		xdoc.async = false;
		xdoc.loadXML(doc);
	}
	
	return xdoc;
}

IG$/*mainapp*/._I14/*loadMapData*/ = function(callback) {
	$.ajax({
		type: "GET",
		url: (window.mapurl || "./data/map.json") + "?uniquekey=" + IG$/*mainapp*/._I4a/*getUniqueKey*/(), 
		dataType: "json",
		timeout: 10000,
		success: function(data) {
			IG$/*mainapp*/.mLU = data;
		},
		error: function(e, status, thrown) {
		}
	});
}

IG$/*mainapp*/._I15/*interpolateColor*/ = function(minColor,maxColor,maxDepth,depth){
	
    function d2h(d) {return d.toString(16);}
    function h2d(h) {return parseInt(h,16);}
   
    if(depth == 0){
        return minColor;
    }
    if(depth == maxDepth){
        return maxColor;
    }
   
    var color = "#",
    	minVal,
    	maxVal,
    	nVal,
    	val,
    	i;
    for(i=1; i <= 6; i+=2){
        minVal = Number(h2d(minColor.substr(i,2)));
        maxVal = Number(h2d(maxColor.substr(i,2)));
        nVal = minVal + (maxVal-minVal) * (depth/maxDepth);
        val = d2h(Math.floor(nVal));
        while(val.length < 2){
            val = "0"+val;
        }
        color += val;
    }
    return color;
};

IG$/*mainapp*/._I16/*stripXMLContent*/ = function(doc)
{
	/*
	var dindex = doc.indexOf("|");
	var msgid = doc.substring(0, dindex);
	doc = doc.substring(dindex+1);
	*/
	
	return doc;
}

IG$/*mainapp*/._I17/*getFirstChild*/ = function(node) {
	var children = IG$/*mainapp*/._I26/*getChildNodes*/(node);
	
	if (children != null && children.length > 0)
	{
		return children[0];
	}
	
	return null;
}

IG$/*mainapp*/._I18/*XGetNode*/ = function(doc, path) {
	var root = null;
	
	var plist = path.split("/");
	var n = 0;
	
	var unode = doc;
	
	if (plist[0] == "")
	{
		unode = doc.getElementsByTagName(plist[1])[0];
		n = 2;
	}
	
	var nd = null;
	
	for (i=n; i < plist.length; i++)
	{
		unode = IG$/*mainapp*/._I19/*getSubNode*/(unode, plist[i]);
		if (unode == null || unode == undefined)
			break;
	}
	
	nd = unode;
	
	return nd;
}

IG$/*mainapp*/._I19/*getSubNode*/ = function(unode, pname) {
	var nd = null,
		snode = null,
		i;
	
	if (unode != null && unode.hasChildNodes() == true)
	{
		snode = IG$/*mainapp*/._I26/*getChildNodes*/(unode);
		
		for (i=0; i < snode.length; i++)
		{
			if (snode[i].nodeName == pname)
			{
				nd = snode[i];
				break;
			}
		}
	}
	
	return nd;
}

IG$/*mainapp*/._I1a/*getSubNodeText*/ = function(unode, pname) {
	var m = IG$/*mainapp*/._I19/*getSubNode*/(unode, pname);
	
	if (m)
	{
		return IG$/*mainapp*/._I24/*getTextContent*/(m);
	}
	
	return null;
}

IG$/*mainapp*/._I1b/*XGetAttr*/ = function(node, name) {
	var value = "";
	
	value = node.getAttribute(name);
	
	return value;
}

IG$/*mainapp*/._I1c/*XGetAttrProp*/ = function(node) {
	var obj = {},
		browser = window.bowser;
		
	for (var i=0; i < node.attributes.length; i++)
	{
		obj[(browser.msie ? node.attributes[i].nodeName : node.attributes[i].localName)] = node.attributes[i].value;
	}
	
	return obj;
}

IG$/*mainapp*/._$A/*placeholder*/ = function(ctrl) {
	var browser = window.bowser,
		placeholder = ctrl.attr("placeholder");
	
	if (browser.msie && placeholder)
	{
		ctrl.bind({
			"focus": function(e) {
				var input = $(this);
				if (input.val() == input.attr("placeholder")) {
					input.val("");
					input.removeClass("placeholder");
				}
			},
			"blur": function(e) {
				var input = $(this);
				if (input.val() == "" || input.val() == input.attr("placeholder")) {
					input.addClass("placeholder");
					input.val(input.attr("placeholder"));
				}
				else
				{
					input.removeClass("placeholder");
				}
			},
			"keyup": function(e) {
				var input = $(this);
				if (input.val() == "") {
					input.blur();
				}
			}
		}).blur();
	}
}

IG$/*mainapp*/._I1d/*CopyObject*/ = function(src, tgt, attr) {
	var i,key;
	
	attr = (attr) ? ";" + attr + ";" : attr;
	
	tgt = (!tgt) ? {} : tgt;
	
	for (key in src)
	{
		if (attr && attr.indexOf(";" + key+";") > -1)
		{
			tgt[key] = src[key];
		}
		else if (!attr)
		{
			tgt[key] = src[key];
		}
	}
	return tgt;
}

IG$/*mainapp*/._I1e/*CloneObject*/ = function(src) {
	var i,key;
	var tgt = {};
	for (key in src)
	{
		tgt[key] = src[key];
	}
	return tgt;
}

IG$/*mainapp*/._I1f/*XGetInfo*/ = function(obj, node, attr, vtype, ismixed) {
	var i,
		r,
		v,
		attrs = attr.split(";"),
		prop = IG$/*mainapp*/._I1c/*XGetAttrProp*/(node),
		aname;
		
	for (i=0; i < attrs.length; i++)
	{
		aname = attrs[i];
		if (aname)
		{
			switch (vtype)
			{
			case "i":
				v = (prop[aname] != null && typeof prop[aname] != "undefined") ? Number(prop[aname]) : null;
				break;
			case "b":
				if (prop[aname] == "T")
					v = true;
				else if (prop[aname] == "F")
					v = false;
				else
					v = null;
				break;
			default:
				v = (prop[aname] != null && typeof prop[aname] != "undefined") ? prop[aname] : null;
				break;
			}
			
			if (ismixed && aname.substring(0, "cdata_".length) == "cdata_")
			{
				v = IG$/*mainapp*/._I1a/*getSubNodeText*/(node, aname);
			}
			
			if (v != null)
			{
				obj[aname] = v;
			}
		}
	}
}

IG$/*mainapp*/._I1fx/*XGetInfoX*/ = function(obj, node, attr) {
	var i,
		attrs = attr.split(";"),
		v, tnode, t;
	for (i=0; i < attrs.length; i++)
	{
		v = attrs[i];
		tnode = IG$/*mainapp*/._I18/*XGetNode*/(node, v);
		if (tnode)
		{
			t = IG$/*mainapp*/._I24/*getTextContent*/(tnode);
		}
		else
		{
			t = IG$/*mainapp*/._I1b/*XGetAttr*/(node, v);
		}
		
		if (t)
		{
			obj[v] = t;
		}
	}
};

IG$/*mainapp*/._I20/*XUpdateInfo*/ = function(obj, attr, vtype, ismixed) {
	var i,
		r,
		v,
		attrs = attr.split(";"),
		aname,
		mvtype;
	r = "";
	
	for (i=0; i < attrs.length; i++)
	{
		aname = attrs[i];
		if (aname && typeof obj[aname] != "undefined" && obj[aname] != null)
		{
			if (aname.substring(0, "cdata_".length) == "cdata_")
			{
				continue;
			}
			
			mvtype = vtype;
			v = obj[aname];
			r += " " + aname + "='";
			if (typeof(v) == "boolean")
			{
				mvtype = "b";
			}
			switch (mvtype)
			{
			case "b":
				r += (v == true) ? "T" : "F";
				break;
			default:
				r += IG$/*mainapp*/._I48/*escapeXMLString*/(v);
				break;
			}
			r += "'";
		}
	}
	
	return r;
}

IG$/*mainapp*/._I21/*XUpdateInfo*/ = function(obj) {
	var i,
		r = "",
		k;
	
	for (k in obj)
	{
		v = obj[k];
		if (v != null && typeof(v) == "string")
		{
			r += " " + k + "='";
			r += IG$/*mainapp*/._I48/*escapeXMLString*/(v);
			r += "'";
		}
	}
	
	return r;
}

IG$/*mainapp*/._I22/*NodeUpdateInfo*/ = function(node, name) {
	var r = ""
		anames = name.split(";"),
		i;
	
	for (i=0; i < anames.length; i++)
	{
		if (anames[i] != "")
		{
			r += " " + anames[i] + "='" + (IG$/*mainapp*/._I48/*escapeXMLString*/(node.get(anames[i])) || "") + "'";
		}
	}
	
	return r;
}

IG$/*mainapp*/._I23/*XSetAttr*/ = function(node, name, value) {
	node.setAttribute(name, value);
}

IG$/*mainapp*/._I24/*getTextContent*/ = function(node) {
	var r = "",
		cnodes,
		cdata,
		i,
		browser = window.bowser;
		
	if (node)
	{
		if (node.hasChildNodes())
		{
			cnodes = node.childNodes;
			for (i=0; i < cnodes.length; i++)
			{
				if (cnodes[i].nodeType == "4")
				{
					cdata = cnodes[i];
					break;
				}
			}
			
			if (cdata)
			{
				r = cdata.nodeValue || cdata.textContent;
				return r;
			}
		}
		
		if (browser.msie)
		{
			r = node.text || node.textContent || "";
		}
		else if (node != null && typeof node.textContent != "undefined")
		{
			return node.textContent;
		}
	}
	
	return r;
}

IG$/*mainapp*/._I25/*toXMLString*/ = function(xdoc) {
	var value = "";
	
	// if ($.browser.msie == true)
	if (!window.XMLSerializer)
	{
		value = xdoc.documentElement ? xdoc.documentElement.xml : xdoc.xml;
	}
	else
	{
		value = (new XMLSerializer()).serializeToString(xdoc);
	}
	return value;
}

IG$/*mainapp*/._I26/*getChildNodes*/ = function(node, nodename) {
	var nodes = [];
	
	if (node != null && node.hasChildNodes() == true)
	{
		for (var i=0; i < node.childNodes.length; i++)
		{
			if (node.childNodes[i].nodeType == "1" && node.childNodes[i].nodeName != "parseerror") {
				if (!(nodename && nodename != IG$/*mainapp*/._I29/*XGetNodeName*/(node.childNodes[i])))
				{
					nodes.push(node.childNodes[i]);
				}
			}
		}
	}
	
	return nodes;
}

IG$/*mainapp*/._I27/*getErrorCode*/ = function(doc) {
	var root = IG$/*mainapp*/._I18/*XGetNode*/(doc, "/smsg");
	var errcode = IG$/*mainapp*/._I1b/*XGetAttr*/(root, "errorcode");
	
	return errcode;
}

IG$/*mainapp*/._I28/*getTabTitle*/ = function(text) {
	var ntitle = text,
		nlength = 16;
	
	if (ntitle.length > nlength)
	{
		ntitle = ntitle.substring(0, nlength - 2) + "..";
	}
	
	return ntitle;
}

IG$/*mainapp*/._I29/*XGetNodeName*/ = function(node) {
	return node.nodeName;
}

IG$/*mainapp*/._I2a/*parseValueList*/ = function(xdoc) {
	var i, j, clen, cfield, m, sfield,
		item,
		obj, dnode, dnodes, uid, vnode, delimiter, d,
		mnode =  IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
		mchild = (mnode ? IG$/*mainapp*/._I26/*getChildNodes*/(mnode) : null),
		snode,
		hnode,
		hnodes,
		dnode,
		tpnode, tpnodes,
		vnode,
		cols, cols_m1,
		mval, dt, vt,
		results = [];
	
	if (mchild)
	{
		for (m=0; m < mchild.length; m++)
		{
			snode = IG$/*mainapp*/._I18/*XGetNode*/(mchild[m], "result");
			hnode = IG$/*mainapp*/._I18/*XGetNode*/(mchild[m], "result/Header");
			hnodes = (hnode ? IG$/*mainapp*/._I26/*getChildNodes*/(hnode) : null);
			dnode = IG$/*mainapp*/._I18/*XGetNode*/(mchild[m], "result/Data");
			tpnode = IG$/*mainapp*/._I18/*XGetNode*/(mchild[m], "result/TupleData");
			tpnodes = (tpnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tpnode) : null);
			
			obj = null;
			
			if (snode && hnode && hnodes && dnode)
			{
				delimiter = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "delimiter");
				cfield = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "codefield");
				sfield = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "sortfield");
				cols = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "cols");
				cols = parseInt(cols);
				cols_m1 = cols-1;
				dnode = IG$/*mainapp*/._I24/*getTextContent*/(dnode);
				dnode = dnode ? dnode.split(delimiter) : [];
				if (dnode.length > 0 && dnode[dnode.length - 1] == "")
				{
					dnode.splice(dnode.length-1, 1);
				}
				clen = hnodes.length;
				
				for (i=0; i < hnodes.length; i++)
				{
					uid = IG$/*mainapp*/._I1b/*XGetAttr*/(hnodes[i], "uid");
					if (i == 0)
					{
						obj = IG$/*mainapp*/._I1c/*XGetAttrProp*/(hnodes[i]);
						obj.data = [];
					}
				}
				
				if (clen == 1)
				{
					for (i=0; i < dnode.length; i++)
					{
						obj.data.push({
							code: dnode[i],
							disp: null,
							sdisp: null
						});
					}
				}
				else
				{
					for (i=0; i < dnode.length; i++)
					{
						if (cols_m1 == 0)
						{
							mval = {
								code: dnode[i],
								disp: null,
								sdisp: null
							};
							obj.data.push(mval);
						}
						else
						{
							if (i % cols == 0)
							{
								mval = {
									code: dnode[i],
									disp: null,
									sdisp: null
								}
								obj.data.push(mval);
							}
							else if (i % cols == 1)
							{
								mval.disp = dnode[i];
							}
							else if (i % cols == 2)
							{
								mval.sdisp = dnode[i];
							}
						}
					}
				}
				
				/*
				obj.data.sort(function(a, b) {
					var m1 = a.sdisp || a.code,
						m2 = b.sdisp || b.code;
						
					return (m1 - m2);
				});
				*/
			}
			else if (tpnode)
			{
				obj = IG$/*mainapp*/._I1c/*XGetAttrProp*/(mchild[m]);
				
				delimiter = IG$/*mainapp*/._I1b/*XGetAttr*/(snode, "delimiter");
				
				for (i=0; i < tpnodes.length; i++)
				{
					uid = IG$/*mainapp*/._I1b/*XGetAttr*/(tpnodes[i], "uid");
					if (uid == obj.uid)
					{
						vnode = IG$/*mainapp*/._I18/*XGetNode*/(tpnodes[i], "DataList");
						dnode = IG$/*mainapp*/._I18/*XGetNode*/(tpnodes[i], "ValueList");
						dt = IG$/*mainapp*/._I24/*getTextContent*/(vnode);
						dt = dt.split(delimiter);
						
						if (dnode)
						{
							vt = IG$/*mainapp*/._I24/*getTextContent*/(dnode);
							if (vt)
							{
								vt = vt.split(delimiter);
							}
							else
							{
								vt = null;
							}
						}
						
						obj.data = [];
						if (dt.length > 0)
						{
							for (i=0; i < dt.length - 1; i++)
							{
								obj.data.push({
									code: dt[i],
									disp: vt && vt.length > i ? vt[i] : null,
									sdisp: null
								});
							}
						}
						break;
					}
				}
			}
			
			if (obj)
			{
				results.push(obj);
			}
		}
	}
	
	return results;
}





IG$/*mainapp*/._I2b/*getFieldValue*/ = function(owner, cname, ctype) {
	var ctrl = owner.down.call(owner, "[name=" + cname + "]"),
		r = null;
	
	if (ctrl)
	{
		switch (ctype)
		{
		case "s":
			r = ctrl.getValue();
			break;
		case "dg":
			
			break;
		}
	}
	
	return r;
}

IG$/*mainapp*/._I2c/*setFieldValue*/ = function(owner, cname, ctype, value) {
	var ctrl = owner.down.call(owner, "[name=" + cname + "]");

	if (ctrl)
	{
		switch (ctype)
		{
		case "s":
			ctrl.setValue(value);
			break;
		case "dg":
			ctrl.store.loadData(value);
			break;
		}
	}
}

IG$/*mainapp*/._I2d/*getItemAddress*/ = function(item, field) {
	item.type = item.type || item.itemtype;
	var r = "<smsg><item " + IG$/*mainapp*/._I20/*XUpdateInfo*/(item, field || "uid;nodepath;name;pid;address;description;type;revision", "s") + "/></smsg>";
	return r;
}

IG$/*mainapp*/._I2e/*getItemOption*/ = function(item, p1, datavalue) {
	var r = "<smsg>",
		k;
	if (item)
	{
		r += "<info ";
		r += IG$/*mainapp*/._I30/*getXMLAttr*/(item);
		
		if (datavalue)
		{
			if (datavalue.length)
			{
				r += ">";
				for (k=0; k < datavalue.length; k++)
				{
					r += "<" + datavalue[k].name + "><![CDATA[" + datavalue[k].value + "]]></" + datavalue[k].name + ">";
				}
				r += "</info>";
			}
			else
			{
				r += "><" + datavalue.name + "><![CDATA[" + datavalue.value + "]]></" + datavalue.name + "></info>";
			}
		}
		else
		{
			r += "/>";	
		}
	}
	r += "</smsg>";
	return r;
}

IG$/*mainapp*/.aa/*applyOptions*/ = function(panel, opt, names, isupdate) {
	$.each(names, function(k, nm) {
		var p = panel.down("[name=" + nm + "]");
		
		if (p)
		{
			if (isupdate)
			{
				if (p.xtype == "checkbox")
				{
					opt[nm] = p.getValue() ? "T" : "F";
				}
				else
				{
					opt[nm] = p.getValue();
				}
			}
			else
			{
				if (p.xtype == "checkbox")
				{
					p.setValue(opt[nm] == "T");
				}
				else
				{
					p.setValue(opt[nm]);
				}
			}
		}
	});
};

IG$/*mainapp*/._I2f/*getObjAddress*/ = function(item) {
	var r = "<smsg><item ",
		k;
	
	for (k in item)
	{
		r += " " + k + "='" + IG$/*mainapp*/._I48/*escapeXMLString*/(item[k]) + "'";
	}	
	
	r += "/></smsg>";
	return r;
}

IG$/*mainapp*/._I30/*getXMLAttr*/ = function(item) {
	var k, r = "";
	for (k in item)
	{
		if (typeof(item[k]) == "string" || typeof(item[k]) == "number")
		{
			r += " " + k + "='" + IG$/*mainapp*/._I48/*escapeXMLString*/(item[k]) + "'";
		}
	}
	
	return r;
}

IG$/*mainapp*/._I31/*hasElement*/ = function(node, element) {
	var i, havone = false;
	if (node && node.children)
	{
		for (i=0; i < node.children.length; i++)
		{
			if (node.children[i] == element)
			{
				return true;
			}
			else if (node.children[i].children && node.children[i].children.length > 0)
			{
				havone = IG$/*mainapp*/._I31/*hasElement*/(node.children[i], element);
				if (havone == true)
					return true;
			}
		}
	}
	
	return havone;
}

IG$/*mainapp*/._I32/*charttypemenu*/ = [
	{label:"Column", charttype:"cartesian", subtype:"column", img: "column"},
	{label:"Line", charttype:"cartesian", subtype:"line", img: "line"},
	{label:"Area", charttype:"cartesian", subtype:"area", img: "area"},
	{label:"Bar", charttype:"cartesian", subtype:"bar", img: "bar"},
	{label:"Pie", charttype:"pie", subtype:"pie", img: "pie"},
	{label:"Doughnut", charttype:"pie", subtype:"doughnut", img: "pie"},
	{label:"Bubble", charttype:"bubble", subtype:"bubble", img: "bubble"},
	{label:"Scatter", charttype:"scatter", subtype:"scatter", img: "bubble"},
	//{label:"Radar", charttype:"radar", subtype:"radar", img: "radar"},
	//{label:"Candlestick", charttype:"candlestick", subtype:"candlestick", img: "candlestick"},
	//{label:"OHLC", charttype:"candlestick", subtype:"ohlc", img: "hloc"},
	//{label:"World Map", charttype:"map", subtype:"worldmap"},
	//{label:"US Map", charttype:"map", subtype:"usmap"},
	//{label:"Seoul Map", charttype:"map", subtype:"seoulmap"},
	{label:"DataGrid", charttype:"datagrid", subtype:"datagrid"}
];

IG$/*mainapp*/._I33/*getPrintXML*/ = function(node) {
	var doc,
		browser = window.bowser;
		
	if (browser.msie)
	{
		doc = node.outerHTML;
	}
	else
	{
		doc = (new XMLSerializer()).serializeToString(node);
	}
	
	return doc;
}

IG$/*mainapp*/._I34/*isNumericType*/ = function(type) {
	var r = false;
	type = (type) ? type.toLowerCase() : "";
	switch (type)
	{
	case "numeric":
	case "number":
	case "int":
	case "bigint":
	case "decimal":
		r = true;
		break;
	}
	
	return r;
}

IG$/*mainapp*/._I35/*FormatNumber*/ = function(value)
{
	value += "";
	x = value.split(".");
	x1 = x[0];
	x2 = x.length > 1 ? "." + x[1] : "";
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, "$1" + "," + "$2");
	}
	return x1 + x2;
}

IG$/*mainapp*/._I36/*getSeriesType*/ = function(subtype) {
	var stype = "column";
	
	switch (subtype)
	{
	case "column":
		stype = "column";
		break;
	case "line":
		stype = "line";
		break;
	case "spline":
		stype = "spline";
		break;
	case "area":
		stype = "area";
		break;
	case "bar":
		stype = "bar";
		break;
	case "pie":
		stype = "pie";
		break;
	case "doughnut":
		stype = "pie";
		break;
	case "bubble":
		stype = "bubble";
		break;
	case "scatter":
		stype = "scatter";
		break;
	case "parallel":
		stype = "parallel";
		break;
	case "waterfall":
		stype = "waterfall";
		break;
	case "areaspline":
		stype = "areaspline";
		break;
	}
	
	return stype;
};

IG$/*mainapp*/._I37/*isNumber*/ = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};


/**
 * Other utility
 */

//This function removes non-numeric characters
IG$/*mainapp*/._I38/*stripNonNumeric*/ = function(str) {
  str += "";
  var rgx = /^\d|\.|-$/;
  var out = "";
  for( var i = 0; i < str.length; i++ )
  {
    if( rgx.test( str.charAt(i) ) ){
      if( !( ( str.charAt(i) == "." && out.indexOf( "." ) != -1 ) ||
             ( str.charAt(i) == "-" && out.length != 0 ) ) ){
        out += str.charAt(i);
      }
    }
  }
  return out;
};

IG$/*mainapp*/._I39/*validateEmail*/ = function(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

IG$/*mainapp*/._I3a/*rsaPublicKeyModulus*/ = null;
IG$/*mainapp*/._I3b/*rsaPpublicKeyExponent*/ = null;

IG$/*mainapp*/._I3c/*encryptkey*/ = function(str) {
	var i;
	
	if (IG$/*mainapp*/._I3a/*rsaPublicKeyModulus*/) 
	{
		var rsa = new RSAKey();
		rsa.setPublic(IG$/*mainapp*/._I3a/*rsaPublicKeyModulus*/, IG$/*mainapp*/._I3b/*rsaPpublicKeyExponent*/);
		
		for (i=0; i < str.length; i++)
		{
			str[i] = rsa.encrypt(str[i]);
		}
	}
	
	return str;
}

Number.prototype.format = function(format) {
	var that = this,
		cf;
		
	if (typeof(format) != "string") 
		return ""; // sanity check
		
	if (format.indexOf(";") > -1) // supplementary
	{
		cf = format.split(";");
		
		if (cf.length == 2 && cf[1])
		{
			if (that < 0)
			{
				format = cf[1];
				 if (format.length > 2 && format.charAt(0) == "(" && format.charAt(format.length - 1) == ")")
				 {
					that = Math.abs(that);
				 }
			}
			else
			{
				format = cf[0];
			}
		}
	}

	var hasComma = -1 < format.indexOf(","),
		psplit = IG$/*mainapp*/._I38/*stripNonNumeric*/(format).split(".");

	// compute precision
	if (1 < psplit.length) {
		// fix number precision
		that = that.toFixed(psplit[1].length);
	}
	// error: too many periods
	else if (2 < psplit.length) {
		throw("NumberFormatException: invalid format, formats should have no more than 1 period: " + format);
	}
	// remove precision
	else {
		that = that.toFixed(0);
	}
	
	if (format.substring(format.length - 1) == "%")
	{
		that = Number(that) * 100;
	}
	else if (format.substring(format.length - 3) == "'%'")
	{
		format = format.substring(0, format.length - 3) + "%";
	}

	// get the string now that precision is correct
	var fnum = that.toString();

	// format has comma, then compute commas
	if (hasComma) {
		// remove precision for computation
		psplit = fnum.split(".");
		
		var cnum = psplit[0],
			parr = [],
			j = cnum.length,
			m = Math.floor(j / 3),
			n = cnum.length % 3 || 3; // n cannot be ZERO or causes infinite loop

		// break the number into chunks of 3 digits; first chunk may be less than 3
		for (var i = 0; i < j; i += n) {
			if (i != 0) {n = 3;}
			parr[parr.length] = cnum.substr(i, n);
			m -= 1;
		}

		// put chunks back together, separated by comma
		fnum = parr.join(",");

		// add the precision back in
		if (psplit[1]) {fnum += "." + psplit[1];}
	}

	// replace the number portion of the format with fnum
	return format.replace(/[\d,?,#\.?,#]+/, fnum);
};

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.deleteRow = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


IG$/*mainapp*/._I3d/*callBackObj*/ = function(callerptr, callexec, callparam) {
	this.p1/*callerptr*/ = callerptr;
	this.p2/*callexec*/ = callexec;
	this.p3/*callparam*/ = callparam;
}

IG$/*mainapp*/._I3d/*callBackObj*/.prototype = {
	execute: function(extra) {
		var ret;
		if (this.p2/*callexec*/)
		{
			if (this.p1/*callerptr*/)
			{
				ret = this.p2/*callexec*/.call(this.p1/*callerptr*/, (extra ? extra : this.p3/*callparam*/), this.p3/*callparam*/);
			}
			else
			{
				ret = this.p2/*callexec*/((extra ? extra : this.p3/*callparam*/));
			}
		}
		
		return ret;
	}
};

IG$/*mainapp*/._I3e/*requestServer*/ = function() {
	this.atld/*stoploading*/ = true;
}

IG$/*mainapp*/._I3e/*requestServer*/.prototype = {
	init: function(panel, params, caller, rsSuccess, rsFail, rsParams) {
		this.panel = panel;
		if (ig$/*appoption*/.isdev != true)
		{
			this.params = {
				data: Base64.encode(params.cmd) + "|" + Base64.encode(params.obj),
				content: Base64.encode(params.cnt)
			};
		}
		else
		{
			this.params = params;
		}
	
		this.caller = caller;
		this.rsSuccess = rsSuccess;
		this.rsFail = rsFail;
		this.rsParams = rsParams;
		this.showerror = true;
		this.atld/*stoploading*/ = true;
		
		if (!rsFail && typeof(Ext) != "undefined" && extjsphone)
		{
			this.rsFail = null;
		}
		
		this.sccall = new IG$/*mainapp*/._I3d/*callBackObj*/(this.caller, this.rsSuccess, this.rsParams);
		this.scfail = new IG$/*mainapp*/._I3d/*callBackObj*/(this.caller, this.rsFail, this.rsParams);
	},

	_l/*request*/: function() {
		var req = this,
			ret,
			xparam = IG$/*mainapp*/._I13/*loadXML*/(req.params.payload),
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xparam, "/smsg"),
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode),
			p, k, pnames;
		
		if (tnodes.length == 1 && !tnodes[0].hasChildNodes())
		{
			pnames = [];
			delete req.params.payload;
			p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[0]);
			for (k in p)
			{
				req.params[k] = p[k];
				pnames.push(k);
			}
			req.params.__i = pnames.join(";");
		}
		
		req.params._mts_ = IG$/*mainapp*/._g$a/*global_mts*/ || "";
		
		if (req.params.mbody && req.params.mbody.substring(0, "<smsg><info ".length) == "<smsg><info ")
		{
			xparam = IG$/*mainapp*/._I13/*loadXML*/(req.params.mbody);
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xparam, "/smsg");
			tnodes = IG$/*mainapp*/._I26/*getChildNodes*/(tnode);
			
			if (tnodes.length == 1 && !tnodes[0].hasChildNodes())
			{
				pnames = [];
				delete req.params.mbody;
				p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[0]);
				for (k in p)
				{
					req.params[k] = p[k];
					pnames.push(k);
				}
				req.params.__g = pnames.join(";");
			}
		}
		
		req.params.uniquekey = IG$/*mainapp*/._I4a/*getUniqueKey*/();
		
		window.Pace && window.Pace.start();
		
		$.ajax({
			url: ig$/*appoption*/.servlet,
			data: req.params,
			dataType: "text",
			type: "POST",
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			timeout: 600000,
			beforeSend: function(xhr, settings) {
			},
			cache: false,
			crossDomain: false,
			processData: true,
			success: function(response, status, xhr) {
				window.Pace && window.Pace.stop();
				
				var doc = response || "<smsg errorcode='0xffff' errormsg='Server incorrect responding'/>",
					xdoc = IG$/*mainapp*/._I13/*loadXML*/(doc),
					errcode = IG$/*mainapp*/._I27/*getErrorCode*/(xdoc),
					stopprog = false;
				
				if (req.panel && req.panel.setLoading)
				{
					if (req.atld/*stoploading*/ != false)
					{
						req.panel.setLoading(false);
					}
					else
					{
						stopprog = true;
					}
				}
				if (errcode == "0x1300")
				{
					if (stopprog == true)
					{
						req.panel.setLoading(false);
					}
					ret = req.scfail.execute(errcode);
						
					if (ret == true || req.showerror == false)
						return;
	
					IG$/*mainapp*/._I89/*showLogin*/((req.panel ? new IG$/*mainapp*/._I3d/*callBackObj*/(req.panel, req.panel.entryLogin) : null), 2);
				}
				else if (errcode != null && errcode.length > 0)
				{
					if (stopprog == true)
					{
						req.panel.setLoading(false);
					}
					
					var rerr = req.scfail.execute(xdoc);
					
					if (req.showerror !== false && rerr != false)
					{
						IG$/*mainapp*/._I51/*ShowErrorMessage*/(xdoc, req.panel, req.params);
					}
				}
				else
				{
                    // IG$/*mainapp*/._I51/*ShowErrorMessage*/(xdoc, req.panel, req.params);
					req.sccall.execute(xdoc);
	            }
			},
			error: function(xhr, status, err) {
				window.Pace && window.Pace.stop();
				
				if (req.panel)
	        	{
	        		req.panel.setLoading(false);
	        	}
				
				if (req.showerror !== false)
				{
	        		IG$/*mainapp*/._I53/*ShowConnectionError*/(req.panel);
	        	}
	        	var doc = "<smsg errorcode='0x9999' errormsg='Server URL Connection Failed'/>",
	        		xdoc = IG$/*mainapp*/._I13/*loadXML*/(doc);
	        	req.scfail.execute(xdoc);
			}
		});
	}
};

$.download = function(url, datas, method){
	//url and data options required
	if( url && datas ){ 
		//data can be string of parameters or array/object
		//datas = typeof datas == "string" ? datas : jQuery.param(datas);
		//split params into form inputs
		var inputs = "",
			i;
		for (i=0; i < datas.length; i++)
		{
			inputs+="<input type='hidden' name='"+ datas[i].name +"' value='"+ datas[i].value +"' />"; 
		}
		//send request
		$("<form action='"+ url + "' method='"+ (method||"post") + "'>" + inputs + "</form>")
		.appendTo("body").submit().remove();
	};
};

IG$/*mainapp*/.measureText = function(fs, text) {
	var sensor = this.sensorDiv;
	
	if (!sensor)
	{
		sensor = $("<div style='margin:0px;padding:0px;display:inline-block;top:-100px'></div>");
		$("body").append(sensor);
		this.sensorDiv = sensor;
	}
	
	sensor.css({fontSize: fs});
	sensor.text(text);
	
	var width = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(sensor),
		height = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(sensor);
	
	// sensor.remove();
	return {width: width || 0, height: height || 0};
};

IG$/*mainapp*/._I0a_/*getDateParse*/ = function(value) {
	var yyyy = value.substr(0, 4),
	MM = value.substr(4, 2),
	dd = value.substr(6, 2),
	hh = value.substr(8, 2),
	mm = value.substr(10, 2);

	var ret = {
		y: yyyy,
		M: MM,
		d: dd,
		h: hh,
		m: mm
	};
	return ret;
}

IG$/*mainapp*/._I40/*formatDate*/ = function(value) {
	var yyyy = value.substr(0, 4),
		MM = value.substr(4, 2),
		dd = value.substr(6, 2),
		hh = value.substr(8, 2),
		mm = value.substr(10, 2);
	
	var ret = yyyy + "-" + MM + "-" + dd + " " + hh + ":" + mm;
	return ret;
}

IG$/*mainapp*/._I41/*dateFormat*/ = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = IG$/*mainapp*/._I41/*dateFormat*/;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
IG$/*mainapp*/._I41/*dateFormat*/.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
IG$/*mainapp*/._I41/*dateFormat*/.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

IG$/*mainapp*/._I42/*getString*/ = function(fs, start, end) {
	var r = fs.substr(start, end);
	
	if (r.charAt(0) == "0")
	{
		r = r.substr(1);
	}
	
	return parseInt(r);
}

IG$/*mainapp*/._I43/*getFormattedDate*/ = function(fs, isdetail) {
	var r = fs;
	
	if (fs && fs.length > 8)
	{
		var yyyy = IG$/*mainapp*/._I42/*getString*/(fs, 0, 4),
			MM = IG$/*mainapp*/._I42/*getString*/(fs, 4, 2),
			dd = IG$/*mainapp*/._I42/*getString*/(fs, 6, 2),
			hh = 0,
			mm = 0,
			ss = 0,
			d;
		
		if (fs.length > 13)
		{
			hh = IG$/*mainapp*/._I42/*getString*/(fs, 8, 2);
			mm = IG$/*mainapp*/._I42/*getString*/(fs, 10, 2);
			ss = IG$/*mainapp*/._I42/*getString*/(fs, 12, 2);
		}
		
		d = new Date(yyyy, MM, dd, hh, mm, ss);
		r = IG$/*mainapp*/._I41/*dateFormat*/(d, (isdetail == true ? "mmm d yyyy, TThh:MM" : "mmm d yyyy"));
	}
	
	return r;
};


IG$/*mainapp*/._I44/*lineInterpolate*/ = function(p1, p2, steps) {
	var xabs = Math.abs( p1.x - p2.x ),
		yabs = Math.abs( p1.y - p2.y ),
		xdiff = p2.x - p1.x,
		ydiff = p2.y - p1.y,
	 
		length = Math.sqrt((Math.pow(xabs, 2) + Math.pow(yabs, 2))),
		xstep = xdiff / steps,
		ystep = ydiff / steps,
	 
		newx = 0,
		newy = 0,
		result = new Array(),
		s;
	 
	for(s = 0; s < steps; s++)
	{
		newx = p1.x + ( xstep * s );
		newy = p1.y + ( ystep * s );
	 
		result.push( {
			x: newx,
			y: newy
		} );
	}
	 
	return result;
}

IG$/*mainapp*/._I45/*generateUniqueTest*/ = function(len) {
	var r = "",
		i, rnum,
		chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";

	for (i=0; i<len; i++) {
		rnum = Math.floor(Math.random() * chars.length);
		r += chars.substring(rnum,rnum+1);
	}
	
	return r;
}

IG$/*mainapp*/._I46/*replaceAll*/ = function(str, s, r) {
	var ret = str;
	
	while (ret.indexOf(s) != -1) {
		ret = ret.replace(s, r);
	}
	
	return ret;
}

IG$/*mainapp*/._I47/*selectAll*/ = function(el) {
	var text = el[0],
		browser = window.bowser;
		
    if (browser.msie) 
    {
        var range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } 
    else if (browser.mozilla || browser.opera) 
    {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    } 
    else if (browser.safari) 
    {
        var selection = window.getSelection();
        selection.setBaseAndExtent(text, 0, text, 1);
    }
};

IG$/*mainapp*/._I48/*escapeXMLString*/ = function(value) {
	var escaped = value,
		findReplace,
		item, i;
	
	if (escaped && typeof(escaped) == "string")
	{
		findReplace = [[/&/g, "&amp;"], [/</g, "&lt;"], [/>/g, "&gt;"], [/"/g, "&quot;"]]
		
		for(i=0; i < findReplace.length; i++) 
		{
			item = findReplace[i];
		    escaped = escaped.replace(item[0], item[1]);
		}
	}
	return escaped;
};

IG$/*mainapp*/._I49/*clipboardcopy*/ = function(value) {
	var browser = window.bowser;
	
	if($.zclip)
	{
		$.zclip({
			path:"./images/ZeroClipboard.swf",
			copy: value
		});
	}
	else if(browser.msie)
	{
		window.clipboardData.setData("Text", value);
	}
};

IG$/*mainapp*/._I4a/*getUniqueKey*/ = function() {
	var dt = new Date();
	var dateStr = "" + dt.getFullYear() + 
				  (1+dt.getMonth()) +
				  dt.getDate() +
				  dt.getHours() + 
				  dt.getMinutes() +
				  dt.getSeconds();
	
	return dateStr;
};

IG$/*mainapp*/._I4b/*checkEmail*/ = function(value) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
};

IG$/*mainapp*/._I4c/*majordateformat*/ = 
	[{name: "YYYY", rname: "YEAR"}, {name: "QUARTER"}, {name: "MM"}, {name: "DD", rname: "DAY"}, {name: "WM", rname: "WEEKMONTH"}, {name: "WEEK"}, {name: "AMPM"}, {name: "HH", rname: "HOUR"}, {name: "MI", rname: "MINUTE"}, {name: "CUSTOM"}];

IG$/*mainapp*/._I4d/*sqldateformat*/ = {
	"auto": {
		"yyyy": "$DATE_YYYY(_date_)$",
		"quarter": "$DATE_QUARTER(_date_)$",
		"mm": "$DATE_MM(_date_)$",
		"dd": "$DATE_DD(_date_)$",
		"wm": "$DATE_WM(_date_)$",
		"week": "$DATE_WEEK(_date_)$",
		"ampm": "$DATE_AMPM(_date_)$",
		"hh": "$DATE_HH(_date_)$",
		"mi": "$DATE_MINUTE(_date_)$",
		"custom": "$DATE_CUSTOM(_date_, _format)$"
	},
	"mysql": {
		"yyyy": "DATE_FORMAT(_date_, '%Y')",
		"quarter": "QUARTER(_date_)",
		"mm": "DATE_FORMAT(_date_, '%c')",
		"dd": "DATE_FORMAT(_date_, '%e')",
		"wm": "WEEK(_date_, 5) - WEEK(DATE_SUB(_date_, INTERVAL DAYOFMONTH(_date_) - 1 DAY), 5) + 1",
		"week": "DATE_FORMAT(_date_, '%W')",
		"ampm": "DATE_FORMAT(_date_, '%p')",
		"hh": "DATE_FORMAT(_date_, '%k')",
		"mi": "DATE_FORMAT(_date_, '%i')",
		"custom": "DATE_FORMAT(_date_, '%b %e, %Y %k-%i')"
	},
	"oracle": {
		"yyyy": "to_char(_date_, 'yyyy')",
		"quarter": "to_char(_date_, 'Q')",
		"mm": "to_char(_date_, 'mm')",
		"dd": "to_char(_date_, 'dd')",
		"wm": "to_char(_date_, 'W')",
		"week": "to_char(_date_, 'DY')",
		"ampm": "to_char(_date_, 'AM')",
		"hh": "to_char(_date_, 'HH')",
		"mi": "to_char(_date_, 'MI')",
		"custom": "to_char(_date_, '_format')"
	}
};

Date.prototype.format = function(format) {
    var returnStr = "";
    var replace = Date.replaceChars;
    for (var i = 0; i < format.length; i++) {       var curChar = format.charAt(i);         if (i - 1 >= 0 && format.charAt(i - 1) == "\\") {
            returnStr += curChar;
        }
        else if (replace[curChar]) {
            returnStr += replace[curChar].call(this);
        } else if (curChar != "\\"){
            returnStr += curChar;
        }
    }
    return returnStr;
};

Date.replaceChars = {
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    longMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    longDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],

    // Day
    d: function() { return (this.getDate() < 10 ? "0" : "") + this.getDate(); },
    D: function() { return Date.replaceChars.shortDays[this.getDay()]; },
    j: function() { return this.getDate(); },
    l: function() { return Date.replaceChars.longDays[this.getDay()]; },
    N: function() { return this.getDay() + 1; },
    S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? "st" : (this.getDate() % 10 == 2 && this.getDate() != 12 ? "nd" : (this.getDate() % 10 == 3 && this.getDate() != 13 ? "rd" : "th"))); },
    w: function() { return this.getDay(); },
    z: function() { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now
    // Week
    W: function() { var d = new Date(this.getFullYear(), 0, 1); return Math.ceil((((this - d) / 86400000) + d.getDay() + 1) / 7); }, // Fixed now
    // Month
    F: function() { return Date.replaceChars.longMonths[this.getMonth()]; },
    m: function() { return (this.getMonth() < 9 ? "0" : "") + (this.getMonth() + 1); },
    M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },
    n: function() { return this.getMonth() + 1; },
    t: function() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 0).getDate() }, // Fixed now, gets #days of date
    // Year
    L: function() { var year = this.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },   // Fixed now
    o: function() { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear();}, //Fixed now
    Y: function() { return this.getFullYear(); },
    y: function() { return ("" + this.getFullYear()).substr(2); },
    // Time
    a: function() { return this.getHours() < 12 ? "am" : "pm"; },
    A: function() { return this.getHours() < 12 ? "AM" : "PM"; },
    B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
    g: function() { return this.getHours() % 12 || 12; },
    G: function() { return this.getHours(); },
    h: function() { return ((this.getHours() % 12 || 12) < 10 ? "0" : "") + (this.getHours() % 12 || 12); },
    H: function() { return (this.getHours() < 10 ? "0" : "") + this.getHours(); },
    i: function() { return (this.getMinutes() < 10 ? "0" : "") + this.getMinutes(); },
    s: function() { return (this.getSeconds() < 10 ? "0" : "") + this.getSeconds(); },
    u: function() { var m = this.getMilliseconds(); return (m < 10 ? "00" : (m < 100 ?
"0" : "")) + m; },
    // Timezone
    e: function() { return "Not Yet Supported"; },
    I: function() { return "Not Yet Supported"; },
    O: function() { return (-this.getTimezoneOffset() < 0 ? "-" : "+") + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? "0" : "") + (Math.abs(this.getTimezoneOffset() / 60)) + "00"; },
    P: function() { return (-this.getTimezoneOffset() < 0 ? "-" : "+") + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? "0" : "") + (Math.abs(this.getTimezoneOffset() / 60)) + ":00"; }, // Fixed now
    T: function() { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, "$1"); this.setMonth(m); return result;},
    Z: function() { return -this.getTimezoneOffset() * 60; },
    // Full Date/Time
    c: function() { return this.format("Y-m-d\\TH:i:sP"); }, // Fixed now
    r: function() { return this.toString(); },
    U: function() { return this.getTime() / 1000; }
};

IG$/*mainapp*/._I4e/*ColumnsToString*/ = function(columns, cname) {
	var i,
		r = "";
	for (i=0; i < columns.length; i++)
	{
		columns[i].type = columns[i].type || columns[i].itemtype;
		r += "<" + cname + " " + IG$/*mainapp*/._I20/*XUpdateInfo*/(columns[i], "uid;fieldname;name;type;datatype;size;tablename;alias", "s") + ">";
		if (columns[i].dataoption && columns[i].dataoption.valuetype)
		{
			r += "<dataoption " + IG$/*mainapp*/._I20/*XUpdateInfo*/(columns[i].dataoption, "datadelimiter;coldelimiter;valuetype") + "><![CDATA[" + (columns[i].dataoption.data || "") + "]]></dataoption>";
		}
		r += "</" + cname + ">";
	}
	
	return r;
}

IG$/*mainapp*/._I4f/*parseColumn*/ = function(node) {
	var column = IG$/*mainapp*/._I1c/*XGetAttrProp*/(node);
	var dopt = IG$/*mainapp*/._I19/*getSubNode*/(node, "dataoption");
	if (dopt)
	{
		column.dataoption = IG$/*mainapp*/._I1c/*XGetAttrProp*/(dopt);
		column.dataoption.data = IG$/*mainapp*/._I24/*getTextContent*/(dopt);
	}
	
	return column;
}

IG$/*mainapp*/._I50/*showScheduler*/ = function(runner, uid, itemtype, req, rop) {
	var dlg = new IG$/*mainapp*/.s$ml/*schedule_list*/({
		runner: runner,
		uid: uid,
		itemtype: itemtype,
		req: req,
		_ILa/*reportoption*/: rop
	});
	dlg.show();
}

IG$/*mainapp*/._1/*applyFormOptions*/ = function(opt, map, setval) {
	var me = this,
		i,
		c,
		ot;
		
	for (i=0; i < map.length; i++)
	{
		c = me.down("[name=" + (map[i].c || map[i].n) + "]");
		
		if (setval)
		{
			ot = opt[map[i].n];
			ot = (ot == IG$/*mainapp*/.UNDEFINED || ot == null) ? ot || map[i].s : ot;
			c.setValue(ot);
		}
		else
		{
			if (map[i].d)
			{
				opt[map[i].n] = c.getValue() || map[i].d;
			}
			else
			{
				opt[map[i].n] = c.getValue();
			}
		}
	}
}

IG$/*mainapp*/._l51/*readSysConfig*/ = function(callback) {
	var req,
		uid = "/SYS_Config/systemconfig";
	
	req = new IG$/*mainapp*/._I3e/*requestServer*/();
	req.showerror = false;
	req.init(null, 
		{
            ack: "5",
            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: uid}),
            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
        }, null, function(xdoc) {
        	var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
        		tnodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null),
        		i, p;
        		
        	if (tnodes)
        	{
        		IG$/*mainapp*/._L51/*sysconfig*/ = {};
        		
        		for (i=0; i < tnodes.length; i++)
        		{
        			p = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
        			p.value = IG$/*mainapp*/._I24/*getTextContent*/(tnodes[i]);
        			IG$/*mainapp*/._L51/*sysconfig*/[p.name] = p;
        		}
        	}
        	
        	callback && callback.execute();
        }, function() {
        	callback && callback.execute();
			return false;
        });
	req._l/*request*/();
}

IG$/*mainapp*/.x01/*checkValues*/ = function(form, fieldnames) {
	var r = {
			b: true,
			v: {}
		},
		i,
		ctrl,
		val;
		
	for (i=0; i < fieldnames.length; i++)
	{
		ctrl = form.down("[name=" + fieldnames[i] + "]");
		if (ctrl)
		{
			ctrl.clearInvalid();
			val = ctrl.getValue();
			
			if (!val)
			{
				ctrl.markInvalid(IRm$/*resources*/.r1("B_REQ"));
				r.b = false;
			}
			else 
			{
				r.v[fieldnames[i]] = val;
			}
		}
	}
	
	return r;
};

IG$/*mainapp*/.x02/*fillFormValues*/ = function(form, fitem, fieldnames) {
	var i,
		ctrl,
		val;
		
	for (i=0; i < fieldnames.length; i++)
	{
		ctrl = form.down("[name=" + fieldnames[i] + "]");
		if (ctrl)
		{
			val = fitem[fieldnames[i]];
			ctrl.setValue(val);
		}
	}
}

IG$/*mainapp*/.x03/*getScriptCache*/ = function(scripts, callback) {
	var loaded = [],
		loadScript = function(scs) {
			var sc = scs[0],
				head= document.getElementsByTagName("head")[0],
				script= document.createElement("script");
			
			if (!sc)
			{
				callback && callback.execute();
				return;
			}
			
			scs.splice(0, 1);
			
			script.type= "text/javascript";
			
			if (script.readyState)
			{ 
				// IE
				script.onreadystatechange= function () {
					if (this.readyState == "loaded" || this.readyState == "complete")
					{
						loaded.push(sc);
						loadScript(scs);
						// loaded.length == scripts.length && callback && callback.execute();
					}
				};
			}
			else
			{
				script.onload = function() {
					loaded.push(sc);
					loadScript(scs);
					// loaded.length == scripts.length && callback && callback.execute();
				};
			}
			
			script.src= sc;
	      	head.appendChild(script);
		};
	
	loadScript(scripts);
	
	$.each(scripts, function(i, sc) {
//		$.ajax({
//			type: "get",
//			url: sc + "?_d=" + (window.m$_d || IG$/*mainapp*/._I4a/*getUniqueKey*/()),
//			dataType: "script",
//			cache: true,
//			success: function() {
//				loaded.push(sc);
//				loaded.length == scripts.length && callback && callback.execute();
//			},
//			error: function(e, status, thrown) {
//				IG$/*mainapp*/._I52/*ShowError*/(IRm$/*resources*/.r1("L_ERR_L_SCR"));
//			}
//		});

		
	});
};

IG$/*mainapp*/.x_10/*jqueryExtension*/ = {
	_w: function(jdom, value) {
		var dom = jdom && jdom.length ? jdom[0] : null,
			r = 0;
		
		if (dom)
		{
			if (typeof(value) == "undefined")
			{
				r = dom.offsetWidth || dom.innerWidth || dom.clientWidth;
				r = isNaN(r) ? 0 : r;
			}
			else
			{
				jdom.width(value);
			}
		}
		
		return r;
	},
	_h: function(jdom, value) {
		var dom = jdom && jdom.length ? jdom[0] : null,
			r = 0;
		
		if (dom)
		{
			if (typeof(value) == "undefined")
			{
				r = dom.offsetHeight || dom.innerHeight || dom.clientHeight;
				r = isNaN(r) ? 0 : r;
			}
			else
			{
				jdom.height(value);
			}
		}
		
		return r;
	}
}

IG$/*mainapp*/.xAM/*getReportType*/ = function(cubetype, reporttype) {
	var r = "rolap";
	
	switch (cubetype.toLowerCase())
	{
	case "mcube":
		r = "molap";
		break;
	case "datacube":
		r = "excel";
		break;
	case "nosql":
		r = "nosql";
		break;
	case "sqlcube":
		r = "sqlcube";
		break;
	case "mdbcube":
		r = "mdbcube";
		break;
	case "cube":
		if (reporttype != "rolap" && reporttype != "sql")
		{
			r = "rolap";
		}
		break;
	default:
		r = cubetype.toLowerCase();
		break;
	}
	
	return r;
}
IG$/*mainapp*/._pbm/*mask*/ = function(opt) {
	var me = this,
		lmask,
		lbody,
		bbox,
		mbox;
	
	me.owner = opt.target;
	
	me.mask = $("<div class='igc-loading'></div>");
	
	lmask = $("<div class='igc-loading-mask'></div>").appendTo(me.mask);
	lbody = $("<table class='igc-loading-body'><tr><td></td></tr></table>").appendTo(me.mask);
	bbox = $("<div class='igc-loading-box'><table><tr><td><div class='igc-loading-proc'><div class='spinner'><div class='rect1'></div><div class='rect2'></div><div class='rect3'></div><div class='rect4'></div><div class='rect5'></div></div></div></td><td><span class='igc-loading-msg'></span></td></tr></table></div>").appendTo($("td", lbody));
	
	mbox = $(".igc-loading-msg", bbox);
	
	mbox.append(opt.msg || ig$/*appoption*/.loading_msg);
	
	me.owner.rendermask = me.mask;
	if (opt.dom)
	{
		opt.dom.append(me.mask);
	}
	else
	{
		me.owner._el.dom.append(me.mask);
	}
}

IG$/*mainapp*/._pbm/*mask*/.prototype = {
	show: function() {
		var me = this;
		me.mask.show();
	},
	destroy: function() {
		var me = this;
		
		if (me.mask)
		{
			me.mask.remove();
			me.mask = null;
		}
	}
}

IG$/*mainapp*/.pb = function(opt) {
	var me = this;
	
	me.superclass = IG$/*mainapp*/.pb;
	
	me.__w = -1;
	me.__h = -1;
	me.__ai = 0;
	
	me._lon = {};
	me._sobj = {};
	
	me.rendered = false;
	
	IG$/*mainapp*/.apply(me, opt);
	
	me._ic/*initComponent*/.call(me);
};

IG$/*mainapp*/.pb.prototype = {
	_bc/*createComponent*/: function() {
	},
	
	_ic/*initComponent*/: function() {
		var me = this,
			tbar,
			tbar_items,
			m, btn,
			rendered;
		
		me.media = me.media || {};
		me._el = {};
		me.body = {};
		me._tb = {
			show: (me.header || me.title) ? 1 : 0
		};
		
		if (me.xtype == "toolbar")
		{
			me.height = 26;
		}
			
		me._el.dom = $("<div class='igc-container'></div>");
		me.body.dom = $("<div class='igc-container-body" + (me.bodycls ? " " + me.bodycls : "") + "'></div>").appendTo(me._el.dom);
		me._tb.dom = $("<div class='igc-container-title'><span id='t_text'>" + (me.title || "") + "</span><div class='igc-tools'></div></div>").appendTo(me._el.dom);
		
		if (me._tb.show)
		{
			me._s/*setInnerSize*/(me.__w, me.__h);
		}
		
		if (me.tools && me.tools.length)
		{
			tbar = $(".igc-tools", me._tb.dom);
			
			$.each(me.tools, function(i, t) {
				var tb = $("<div class='igc-button'><div class='igc-tbar-icon'></div></div>").appendTo(tbar);
				
				if (t.cls)
				{
					$(".igc-tbar-icon", tb).addClass(t.cls);
				}
				
				tb.bind("click", function() {
					if (t.handler)
					{
						t.handler.call(t.scope || me, null, null, {
							ownerCt: me
						});
					}
				});
			});
		}
		
		if (me.contentEl)
		{
			me.body.dom.append($(me.contentEl));
		}
		
		switch (me.xtype)
		{
		case "toolbar":
			me.body.dom.addClass("igc-cnt-toolbar");
			me.layout = {
				type: "hbox",
				align: "stretch"
			};
			break;
		case "displayfield":
			me.height = 26;
			me.body.dom.addClass("igc-disp-field");
			me.body.dom.append("<span>" + (me.text || me.value || "") + "</span>");
			break;
		case "textfield":
			me.height = me.height || 26;
			me._lbd = $("<div class='igc-inp-lbl'><span>" + (me.fieldLabel || "") + "</span></div>").appendTo(me.body.dom).hide();
			me._lip = $("<input type='text' class='igc-inp-tfield'></input>").appendTo(me.body.dom);
			break;
		case "checkbox":
			me.height = me.height || 26;
			me._lbd = $("<div class='igc-inp-lbl'><span>" + (me.fieldLabel || "") + "</span></div>").appendTo(me.body.dom).hide();
			me._lip = $("<input type='checkbox' class='igc-inp-tfield'>" + (me.boxLabel ? "<span>" + me.boxLabel + "</span>" : "") + "</input>").appendTo(me.body.dom);
			break;
		case "textarea":
			me._lbd = $("<div class='igc-inp-lbl'><span>" + (me.fieldLabel || "") + "</span></div>").appendTo(me.body.dom).hide();
			me._lip = $("<textarea type='text' class='igc-inp-txtfield'></textarea>").appendTo(me.body.dom);
			break;
		case "button":
			me._el.dom.addClass("igc-cnt-button");
			
			me.body.btn = $("<div class='igc-button'>" + me.text + "</div>").appendTo(me.body.dom);
			
			me.body.btn.bind("click", function(ev) {
				if (me.handler)
				{
					me.handler.call(me.scope || me);
				}
			});
			break;
		case "splitbutton":
			me._el.dom.addClass("igc-cnt-button");
			me.body.btn = $("<div class='igc-button'><span>" + me.text + "</span><div class='igc-split'></div><div>").appendTo(me.body.dom);
			
			if (me.menu && me.menu.items)
			{
				tbar_items = [];
				
				for (i=0; i < me.menu.items.length; i++)
				{
					tbar_items.push({
						name: me.menu.items[i].text,
						key: i
					});
				}
				
				me._cm/*contextmenu*/ = $("<ul class='contextMenu'></ul>")
					.appendTo($("body"));
				me.context = {
					menu: me._cm/*contextmenu*/
				};
				
				if (me.body.btn.contextMenu)
				{
					me.body.btn.contextMenu(me.context, new IG$/*mainapp*/._I3d/*callBackObj*/(me, function(opt) {
						var i,
							cmd = opt.cmd,
							m,
							mobj;
						for (i=0; i < me.menu.items.length; i++)
						{
							m = me.menu.items[i];
							
							if (m.cmd == cmd)
							{
								mobj = m;
								break;
							}
						}
						
						if (mobj && mobj.handler)
						{
							mobj.handler.call(mobj.scope || me);
						}
					}));
					
					me._cm/*contextmenu*/.html("");
					for (i=0; i < me.menu.items.length; i++)
					{
						m = me.menu.items[i];
						m.cmd = "cmd_" + i;
						me._cm/*contextmenu*/.append($("<li><a href='#" + m.cmd + "'>" + m.text + "</a></li>"));
					}
					
					me.body.btn.bind("click", function() {
						var o = me.body.btn.offset();
						me.body.btn.showContextMenu.call(me.body.btn, me.context, o.left, o.top + 22);
					});
				}
			}
			break;
		}
		
		if (me.name)
		{
			me._el.dom.attr("name", me.name);
		}
		
		if (me.xtype == "panel")
		{
			me._el.dom.addClass("igc-panel");
		}
		
		if (me.renderTo)
		{
			rendered = true;
			me._el.dom.appendTo(me.renderTo);
		}
		
		me._bc/*createComponent*/();
		
		me._IT = [];
		
		$.each([me.items, me.dockedItems], function(j, items) {
			var is_dock = (j == 1),
				bt;
			
			if (items)
			{
				$.each(items, function(i, item) {
					var t;
					
					if (item)
					{
						if (item == "->")
						{
							item = {
								xtype: "container",
								flex: 1
							};
						}
						
						item.is_dock = is_dock;
						
						t = me.createObj.call(me, item);
						
						if (t)
						{
							me._IT.push(t);
							t._p = me;
						}
					}
				});
			}
		});
		
		if (me.buttons && me.buttons.length)
		{
			for (i=0; i < me.buttons.length; i++)
			{
				btn = me.buttons[i];
				btn.xtype = btn.xtype || "button";
				btn.width = btn.width || 80;
			}
			
			bt = {
				xtype: "container",
				height: 26,
				dock: "bottom",
				is_dock: true,
				layout: {
					type: "hbox",
					align: "center"
				},
				items: me.buttons
			};
			
			bt = new IG$/*mainapp*/.pbc/*container*/(bt);
			me._IT.push(bt);
			bt._p = me;
		}
		
		if (me.html)
		{
			me.body.dom.append(me.html);
		}
		
		if (me._IT && me._IT.length)
		{
			$.each(me._IT, function(i, s) {
				if (s._el.dom)
				{
					s._el.dom.appendTo(me.body.dom);
					
					if (me.rendered && !s.rendered)
					{
						s.rendered = true;
						s.fireEvent.call(s, "afterrender");
					}
				}
			});
			
			me._v();
		}
		
		if (me.listeners)
		{
			$.each(me.listeners, function(p, l) {
				me._el.dom.bind(p, function(ev) {
					var a = [me],
						c = arguments[1],
						i;
						
					ev.stopPropagation();
					ev.preventDefault();
					
					if (c != me)
					{
						return;
					}
					
					for (i=2; i < arguments.length; i++)
					{
						a.push(arguments[i]);
					}
					
					if (me.listeners.scope)
					{
						l.apply(me.listeners.scope, a);
					}
					else
					{
						l.apply(me, a);
					}
				});
			});
		}
		
		if (me._lon)
		{
			$.each(me._lon, function(p, l) {
				var events = l.events;
				me._el.dom.bind(p, function(ev) {
					var a = [me],
						c = arguments[1],
						i;
						
					ev.stopPropagation();
					ev.preventDefault();
					
					if (c != me)
					{
						return;
					}
						
					for (i=2; i < arguments.length; i++)
					{
						a.push(arguments[i]);
					}
					
					var i;
					
					for (i=0; i < events.length; i++)
					{
						events[i].apply(me, a);
					}
				});
			});
		}
		
		if (me.value)
		{
			me.setValue(me.value);
		}
		
		if (rendered)
		{
			me.rendered = true;
			me.fireEvent("afterrender");
			me.bubbleRender.call(me);
		}
	},
	
	bubbleRender: function() {
		var me = this;
		
		if (me._IT && me._IT.length)
		{
			$.each(me._IT, function(i, s) {
				if (s._el.dom)
				{
					s._el.dom.appendTo(me.body.dom);
					
					if (me.rendered && !s.rendered)
					{
						s.rendered = true;
						s.fireEvent.call(s, "afterrender");
						s.bubbleRender.call(s);
					}
				}
			});
			
			me._v();
		}
	},
	
	createObj: function(item) {
		var me = this,
			t;
		
		switch (item.xtype)
		{
		case "container":
		case "panel":
		case "toolbar":
		case "tbtext":
		case "button":
		case "displayfield":
		case "textfield":
		case "checkbox":
		case "textarea":
			t = new IG$/*mainapp*/.pbc/*container*/(item);
			break;
		case "combobox":
			t = new IG$/*mainapp*/.pbC/*combobox*/(item);
			
			break;
		case "gridpanel":
			t = new IG$/*mainapp*/.pbg/*grid*/(item);
			break;
		default:
			if (item._el)
			{
				t = item;
			}
			else
			{
				
			}
			break;
		}
		
		return t;
	},
	
	add: function(comp) {
		var me = this,
			_IT = me._IT;
		
		if (!comp._el)
		{
			comp = me.createObj.call(me, comp);
		}
		
		_IT.push(comp);
		
		comp._el.dom.appendTo(me.body.dom);
		
		if (me.rendered && !comp.rendered)
		{
			comp.rendered = true;
			comp.fireEvent.call(comp, "afterrender");
			comp.bubbleRender.call(comp);
		}
		
		me._v();
		
		return comp;
	},
	
	insert: function(seq, comp) {
		var me = this,
			_IT = me._IT;
			
		_IT.splice(seq, 0, comp);
		comp._el.dom.appendTo(me.body.dom);
		me._v();
		
		if (me.rendered && !comp.rendered)
		{
			comp.rendered = true;
			comp.fireEvent.call(comp, "afterrender");
			comp.bubbleRender.call(comp);
		}
	},
	
	remove: function(comp) {
		var me = this,
			_IT = me._IT,
			i;
			
		for (i=0; i < _IT.length; i++)
		{
			if (_IT[i] == comp)
			{
				_IT.splice(i, 1);
				comp._el.dom.remove();
				break;
			}
		}
		
		me._v();
	},
	
	removeAll: function() {
		var me = this,
			_IT = me._IT,
			i,
			comp;
			
		for (i=_IT.length-1; i>=0; i--)
		{
			comp = _IT[i];
			comp._el.dom.remove();
		}
		
		me._IT = [];
		
		me._v();
	},
	
	setAutoScroll: function(v) {
		var me = this;
		me.body.dom.css({
			overflowY: v ? "auto" : "none"
		});
	},
	
	down: function(skey) {
		var me = this,
			_IT = me._IT,
			sm,
			i, pobj;
		
		sm = skey.substring(1, skey.length - 1);
		sm = sm.split("=");
		
		for (i=0; i < _IT.length; i++)
		{
			if (sm[1] == _IT[i].name)
			{
				pobj = _IT[i];
				break;
			}
			
			if (!pobj)
			{
				pobj = _IT[i].down(skey);
				
				if (pobj)
					break;
			}
		}
		
		return pobj;
	},
	
	_s/*setInnerSize*/: function(w, h) {
		var me = this,
			bc = false,
			x = 0,
			y = 0,
			padding = me.padding || [0, 0, 0, 0];
		
		if (!w || !h || w < 1 || h < 1)
			return;
		
		if ((me.__w != w || me.__h != h) && w > 0 && h > 0)
		{
			bc = true;
		}
		
		me.__w = w;
		me.__h = h;
		
		me._el.dom.outerWidth(me.__w).outerHeight(me.__h);
		me._tb.dom.outerWidth(me.__w).outerHeight(22);
		
		if (me._tb.show)
		{
			me.body.dom.outerWidth(me.__w).outerHeight(me.__h - 22).css({top: 22});
		}
		else
		{
			me.body.dom.outerWidth(me.__w).outerHeight(me.__h).css({top: 0});
		}
		
		if (me._lbd && me.fieldLabel)
		{
			me._lbd.show();
			me._lbd.css({
				top: 4,
				left: 4,
				height: h - 8,
				width: 100 - 8
			});
			
			x = 100;
		}
		
		if (me._lip)
		{
			me._lip.css({
				top: 4,
				left: x + 4,
				width: w - x - 8,
				height: h - 8
			});
		}
		
		if (bc)
		{
			me.fireEvent("resize", me, me.__w, me.__h);
		}
	},
	
	getComponent: function(id) {
		var me = this,
			r,
			i,
			_IT = me._IT;
		
		for (i=0; i < _IT.length; i++)
		{
			if (_IT[i].id == id)
			{
				r = _IT[i];
				break;
			}
		}
		
		return r;
	},
	
	_m/*movePanel*/: function(x, y) {
		var me = this;
		me._el.dom.css({
			top: y,
			left: x
		});
	},
	
	_v: function() {
		var me = this,
			items = me._IT,
			layout = me.layout,
			i,
			v = 0,
			fl = 0,
			fi = 0,
			fw = me.__w,
			fh = me.__h,
			tx = 0,
			ty = 0,
			iw, ih,
			si,
			hc = 0,
			_iw = 0,
			mw, mh;
			
		if (fw < 1 || fh < 1)
			return;
		
		if (me._tb.show)
		{
			me._tb.dom.show();
			fh -= 22;
		}
		else
		{
			me._tb.dom.hide();
		}
		
		for (i=0; i < items.length; i++)
		{
			si = items[i];
			if (si.is_dock && !si.hidden)
			{
				si.height = si.height || 26;
				
				if (si.dock == "bottom")
				{
					fh -= si.height;
					si._m/*movePanel*/.call(si, 0, ty + fh);
				}
				else
				{
					fh -= si.height;
					si._m/*movePanel*/.call(si, 0, ty);
					ty += si.height;
				}
				
				si._s/*setInnerSize*/.call(si, fw, si.height);
				si._v.call(si);
			}
		}
		
		if (layout == "fit" || layout == "card")
		{
			if (me.padding)
			{
				tx += me.padding;
				ty += me.padding;
				fw -= me.padding * 2;
				fh -= me.padding * 2;
			}
			for (i=0; i < items.length; i++)
			{
				si = items[i];
				
				if (si.is_dock)
					continue;
				
				si._m/*movePanel*/.call(si, tx, ty);
				si._s/*setInnerSize*/.call(si, fw, fh);
				
				if (layout == "card")
				{
					if (me.__ai == i)
					{
						si._el.dom.show();
						si._v.call(si);
					}
					else
					{
						si._el.dom.hide();
					}
				}
				else
				{
					if (!si.hidden)
					{
						si._el.dom.show();
						si._v.call(si);
					}
					else
					{
						si._el.dom.hide();
					}
				}
			}
		}
		else if (layout == "absolute")
		{
			for (i=0; i < items.length; i++)
			{
				si = items[i];
				
				if (si.is_dock)
					continue;
				
				if (si.hidden)
				{
					si._el.dom.hide();
				}
				else
				{
					si._m/*movePanel*/.call(si, si.x, si.y + ty);
					si._s/*setInnerSize*/.call(si, si.width, si.height);
					si._v.call(si);
				}
			}
		}
		else if (layout && layout.type)
		{
			if (layout.type == "vbox")
			{
				v = 1;
			}
			
			if (layout.align == "center")
			{
				hc = 1;
			}
			
			for (i=0; i < items.length; i++)
			{
				si = items[i];
				if (si.is_dock)
					continue;
					
				if (si.hidden)
				{
					si._el.dom.hide();
					continue;
				}
				
				if (si.media.minWidth && fw < si.media.minWidth)
				{
					si._mhidden = 1;
					si._el.dom.hide();
					continue;
				}
				else if (si._mhidden)
				{
					si._mhidden = 0;
					si._el.dom.show();
				}
				
				if (si.flex)
				{
					fl += si.flex;
				}
				else
				{
					if (v == 1)
					{
						if (si.height)
						{
							fi += si.height;
						}
						else
						{
							mh = si.meH/*measureHeight*/.call(si);
							
							if (mh)
							{
								fi += mh;
							}
						}
					}
					else
					{
						if (si.width)
						{
							fi += si.width;
						}
					}
				}
			}
			
			if (v == 0)
			{
				fw -= fi;
			}
			else
			{
				fh -= fi;
			}
			
			if (hc == 1 && v == 0)
			{
				tx = fw - 10;
			}	
			
			for (i=0; i < items.length; i++)
			{
				si = items[i];
				
				if (si.is_dock)
					continue;
					
				if (si.hidden)
					continue;
					
				if (si.flex)
				{
					if (v == 0)
					{
						iw = fw * (si.flex / fl);
						ih = fh;
					}
					else
					{
						ih = fh * (si.flex / fl);
						iw = fw;
					}
				}
				else
				{
					if (v == 0)
					{
						iw = si.width;
						ih = fh;
					}
					else
					{
						iw = fw;
						
						if (si.height)
						{
							ih = si.height;
						}
						else
						{
							ih = si.meH/*measureHeight*/.call(si);
							
							ih = ih || 0;
						}
					}
				}
				
				si.__w = iw;
				si.__h = ih;
				
				if (v == 0)
				{
					si._s/*setInnerSize*/.call(si, iw, ih);
					si._m/*movePanel*/.call(si, tx, ty);
					
					if (!si._mhidden)
					{
						tx += iw;
					}
				}
				else
				{
					si._s/*setInnerSize*/.call(si, iw, ih);
					si._m/*movePanel*/.call(si, tx, ty);
					
					if (!si._mhidden)
					{
						ty += ih;
					}
				}
				
				if (!si._mhidden)
				{
					si._el.dom.show();
				}
				si._v.call(si);
			}
		}
	},
	
	meH/*measureHeight*/: function() {
		var me = this,
			r = 0,
			i,
			items = me._IT;
		
		if (items && items.length)
		{
			for (i=0; i < items.length; i++)
			{
				if (items[i].height)
				{
					r += items[i].height;
				}
			}
		}
		
		return r;
	},
	
	on: function(ev, f) {
		var me = this,
			_el = me._el ? me._el.dom : null;
		
		if (_el)
		{
			_el.bind(ev, function(e) {
				var a = [me],
					c = arguments[1],
					i;
				
				e.stopPropagation();
				e.preventDefault();
				
				if (c != me)
				{
					return;
				}
					
				for (i=1; i < arguments.length; i++)
				{
					a.push(arguments[i]);
				}
				
				f.apply(me, a);
			});
		}
		else
		{
			if (me._lon[ev])
			{
				me._lon[ev].events.push(f);
			}
			else
			{
				me._lon[ev] = {
					name: ev,
					events: [f]
				}
			}
		}
	},
	
	un: function(ev) {
		var me = this,
			_el = me._el ? me._el.dom : null;
			
		if (me._lon[ev])
		{
			delete me._lon[ev];
		}
			
		if (_el)
		{
			_el.unbind(ev);
		}
	},
	
	show: function() {
		this.setVisible(true);
	},
	
	hide: function() {
		this.setVisible(false);
	},
	
	setVisible: function(v) {
		var me = this;
		
		me.hidden = !v;
		me._el.dom[v ? "show" : "hide"]();
		
		if (me._p)
		{
			me._p._v();
		}
		else
		{
			me._v();
		}
	},
	
	setTitle: function(value) {
		// need to implement
		var me = this;
		me.title = value;
		me._tb.show = 0;
		if (value)
		{
			me._tb.show = 1;
			$("#t_text", me._tb.dom).html(value);
		}
		
		me._v();
	},
	
	setValue: function(v) {
		var me = this;
		if (me._lip)
		{
			if (me.xtype == "checkbox")
			{
				if (v == true)
				{
					me._lip.attr("checked", "checked");
				}
				else
				{
					me._lip.removeAttr("checked");
				}
			}
			else
			{
				me._lip.val(v);
			}
		}
	},
	
	getValue: function() {
		var me = this,
			r;
		if (me._lip)
		{
			if (me.xtype == "checkbox")
			{
				r = me._lip.is(":checked") ? true : false;
			}
			else
			{
				r = me._lip.val();
			}
		}
		return r;
	},
	
	clearInvalid: function() {
		var me = this;
		if (me._lbd)
		{
			me._lbd.removeClass("igc-field-error");
		}
	},
	
	markInvalid: function(msg) {
		var me = this;
		
		if (me._lbd)
		{
			me._lbd.addClass("igc-field-error");
		}
	},
	
	setSize: function(w, h) {
		var me = this;
		me.width = w;
		me.height = h;
		
		me._s/*setInnerSize*/(w, h);
		
		me._v();
	},
	
	setPosition: function(x, y) {
		var me = this;
		me.x = x;
		me.y = y;
		
		me._el.dom.css({
			top: y,
			left: x
		});
	},
	
	getWidth: function() {
		return this.__w;
	},
	
	getHeight: function() {
		return this.__h;
	},
	
	fireEvent: function() {
		var me = this,
			ev = arguments[0],
			args = [me],
			i;
			
		for (i=2; i < arguments.length; i++)
		{
			args.push(arguments[i]);
		}
		
		me._el.dom.trigger(ev, args);
	},
	
	setLoading: function(load, targetEl) {
		var me = this,
            config = {
                target: me
            };

        if (me._el.dom) 
        {
            me.loadMask && me.loadMask.destroy();
            config.target.rendermask = null;
            me.loadMask = null;

            if (load !== false) {
                if (IG$/*mainapp*/.isObject(load)) 
                {
                    IG$/*mainapp*/.apply(config, load);
                } 
                else if (IG$/*mainapp*/.isString(load)) 
                {
                    config.msg = load;
                }
                
                me.loadMask = new IG$/*mainapp*/._pbm/*mask*/(config);
                me.loadMask.show();
            }
            else
            {
            	me.fireEvent("_ldx_");
            }
        }
        return me.loadMask;
	},
	
	setActiveItem: function(index) {
		var me = this,
			i,
			_IT = me._IT,
			t = typeof(index);
		
		if (t == "number")
		{
			me.__ai = index;
		}
		else
		{
			me.__ai = -1;
			for (i=0; i < _IT.length; i++)
			{
				if (_IT[i] == index)
				{
					me.__ai = i;
					break;
				}
			}
		}
		
		for (i=0; i < _IT.length; i++)
		{
			_IT[i].hidden = i != me.__ai;
			_IT[i][i == me.__ai ? "show" : "hide"]();
		}
	},
	
	setText: function(value) {
		this.body.dom.text(value);
	},
	
	close: function() {
		this._el.dom.remove();
	}
}

IG$/*mainapp*/.pbc/*container*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pb, {
	_ic/*initComponent*/: function() {
		var me = this,
			i,
			item;
			
		IG$/*mainapp*/.pbc/*container*/.superclass._ic/*initComponent*/.call(me);
	}
});

IG$/*mainapp*/.pbW/*window*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pb, {
	_ic/*initComponent*/: function() {
		var me = this,
			i,
			item,
			mbg,
			bd = $("body"),
			bw = bd.width(),
			bh = bd.height();
			
			me.padding = 5;
			
		IG$/*mainapp*/.pbW/*window*/.superclass._ic/*initComponent*/.call(me);
		
		// IG$/*mainapp*/.pbWm/*window_bg*/ = IG$/*mainapp*/.pbWm/*window_bg*/ || {cnt: 0};
		
		// if (!IG$/*mainapp*/.pbWm/*window_bg*/.bg)
		// {
		me._dB = $("<div class='igc-dlg-body'><div class='bg-trans'></div></div>").appendTo(bd).hide();
		me._dB.append(me._el.dom);
		me._el.dom.addClass("igc-dlg-wnd");
	},
	
	show: function() {
		var me = this,
			bd = $("body"),
			dw = bd.width(),
			dh = bd.height();
			
		me.setPosition((dw - me.width) / 2, (dh - me.height) / 2);
		me.setSize(me.width, me.height);
		
		setTimeout(function() {
			me._dB.show();
			
			me.fireEvent.call(me, "afterrender");
		}, 10);
	},
	
	close: function() {
		var me = this;
		
		IG$/*mainapp*/.pbW/*window*/.superclass.close.call(me);
		
		if (me._dB)
		{
			me._dB.remove();
		}
		me._dB = null;
	}
});
IG$/*mainapp*/.pbgr/*records*/ = function(store, row) {
	var me = this;
	me.data = row;
	me.store = store;
}

IG$/*mainapp*/.pbgr/*records*/.prototype = {
	get: function(dt) {
		return this.data[dt];
	},
	set: function(dt, val) {
		var me = this,
			store = me.store;
		
		me.data[dt] = val;
		
		store.dR/*drawRow*/.call(store, me);
	},
	
	select: function(sel) {
		var me = this,
			store = me.store;
			
		if (me._sm)
		{
			me.sel = sel ? 1 : 0;
			me._sm[sel ? "addClass" : "removeClass"]("igc-check-column-checked");
			
			if (sel && store && store.ownerCt && store.ownerCt.selMode == "SINGLE")
			{
				store._u/*toggleSelection*/.call(store, me);
			}
		}
	}
};

IG$/*mainapp*/.pbgs/*gridstore*/ = function(opt) {
	var me = this,
		i;
	
	IG$/*mainapp*/.apply(me, opt);
	
	if (!me.data)
	{
		me.data = {};
	}
	
	me.data.items = me.data.items || [];
	
	if (opt.data)
	{
		$.each(opt.data, function(n, d) {
			me.add.call(me, d);
		});
	}
};

IG$/*mainapp*/.pbgs/*gridstore*/.prototype = {
	loadData: function(dt) {
		var me = this,
			i,
			ownerCt = me.ownerCt,
			columns = ownerCt.columns,
			_Gb = ownerCt._Gb,
			tw = ownerCt.getWidth(),
			th = ownerCt.getHeight(),
			flex_w = 0, fixed_w = 0,
			ddGroup,
			c,
			tbody;
		
		ddGroup = ownerCt.ddGroup;
		
		if (ownerCt.viewConfig && ownerCt.viewConfig.plugins && ownerCt.viewConfig.plugins.ddGroup)
		{
			ddGroup = ownerCt.viewConfig.plugins.ddGroup;
		}
		
		me.ddGroup = ddGroup;
		
		_Gb.empty();
		ownerCt._uh/*updateHeader*/.call(ownerCt);
		
		tbody = $("<tbody></tbody>").appendTo(_Gb);
		
		me.tbody = tbody;
		
		$.each(dt, function(n, d) {
			me.add.call(me, d);
		});
	},
	add: function(d) {
		var me = this,
			tbody = me.tbody,
			ownerCt = me.ownerCt,
			otype = ownerCt.xtype,
			_lip = ownerCt._lip,
			columns,
			i, j,
			rec,
			img, imgc,
			td,
			tr,
			displayField,
			valueField;
		
		rec = new IG$/*mainapp*/.pbgr/*records*/(me, d);
		
		rec.rindex = me.data.items.length;
		me.data.items.push(rec);
		
		if (otype == "gridpanel")
		{
			columns = me.ownerCt.columns;
			
			tr = $("<tr></tr>").appendTo(tbody);
			
			rec.__h = tr;
			
			tr.bind("click", function(e) {
				e.stopImmediatePropagation();
				e.preventDefault();
				rec.select(!rec.sel);
			});
			
			me.dR/*drawRow*/(rec);
		}
		else if (otype == "combobox")
		{
			displayField = ownerCt.displayField;
			valueField = ownerCt.valueField;
			
			tr = $("<option value='" + rec.get(valueField) + "'>" + rec.get(displayField) + "</option>").appendTo(_lip);
			
			rec.__h = tr;
		}
		
		return rec;
	},
	
	dR/*drawRow*/: function(rec) {
		var me = this,
			ownerCt = me.ownerCt,
			columns = me.ownerCt.columns,
			tr = rec.__h,
			i;
		
		tr.empty();
		
		if (me.ddGroup)
		{
			tr.addClass(me.ddGroup).draggable({
				helper: function() {
					return $(this).clone().appendTo("body").css({
						zIndex: 500
					});
				},
				revert: true,
				containment: "document" //,
				// scope: ddGroup
			}).data("record", rec);
		}
		
		for (i=0; i < columns.length; i++)
		{
			if (columns[i].xtype == "actioncolumn")
			{
				td = $("<td></td>").appendTo(tr);
				
				$.each(columns[i].items, function(m, k) {
					var tbtn = $("<div class='igc-button-grid'><div class='igc-tbar-icon " + k.iconCls + "'></div></div>").appendTo(td);
					tbtn.bind("click", function(ev) {
						ev.stopPropagation();
						ev.preventDefault();
						
						if (k.handler)
						{
							k.handler.call(k.scope || me, me.ownerCt, rec.rindex, i, rec);
						}
					});
				});
			}
			else if (columns[i].xtype == "checkcolumn")
			{
				td = $("<td></td>").appendTo(tr);
				imgc = $("<div class='igc-check-button'></div>").appendTo(td);
				img = $("<div class='igc-check-column'></div>").appendTo(imgc);
				
				rec._sm = img;
				
				img.bind("click", function(e) {
					e.stopImmediatePropagation();
					e.preventDefault();
					rec.select(!rec.sel);
					
					ownerCt._tsm = false;
					if (ownerCt._tsmc)
					{
						ownerCt._tsmc.removeClass("igc-check-column-checked");
					}
				});
			}
			else
			{
				td = $("<td><span>" + (rec.get(columns[i].dataIndex) || "") + "</span></td>").appendTo(tr);
			}
		}
	},
	
	_u/*toggleSelection*/: function(rec, selmode) {
		var i,
			me = this,
			items = me.data.items;
		
		for (i=0; i < items.length; i++)
		{
			if (items[i] != rec)
			{
				items[i].select.call(items[i], selmode || 0);
			}
		}
	},
	
	remove: function(rec) {
		var me = this,
			i,
			items = me.data.items;
			
		for (i=0; i < items.length; i++)
		{
			if (items[i] == rec)
			{
				items.splice(i, 1);
				rec.__h.remove();
				break;
			}
		}
	},
	
	filter: function(flt) {
		var me = this;
		
		if (me.data.items)
		{
			$.each(me.data.items, function(i, rec) {
				var __h = rec.__h,
					v = 1,
					rv;
				
				if (__h)
				{
					if (flt)
					{
						v = 0;
						
						rv = rec.get(flt.name);
						
						if (rv == flt.value)
						{
							v = 1;
						}
					}
				}
				__h[v ? "show" : "hide"]();
			});
		}
	},
	sort: function(c) {
		var d_th = c.d_th,
			me = this,
			ownerCt = me.ownerCt,
			columns = me.ownerCt.columns,
			i, tbody = me.tbody,
			rows = me.data.items;
		
		if (d_th && d_th.th)
		{
			$.each(columns, function(i, cc) {
				if (cc != c && cc.d_th && cc.d_th.s)
				{
					cc.d_th.s.hide();
				}
			});
			
			d_th.s.html(c._sort.asc ? "&#9660;" : "&#9650;");
			d_th.s.show();
			
			rows.sort(function(x, y) {
				var xx = x.data[c.dataIndex],
					yy = y.data[c.dataIndex],
					r = 0;
				
				r = (xx == yy) ? 0 : (xx > yy) ? 1 : -1;
				
				if (!c._sort.asc)
				{
					r *= -1;
				}
				
				return r;
			});
			
			$.each(rows, function(i, rec) {
				rec.__h.detach();
				rec.__h.appendTo(tbody);
			});
		}
	}
};

IG$/*mainapp*/.pbg/*grid*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pb, {
	getSelectionModel: function() {
		var me = this,
			r = {
				selected: []
			},
			i,
			store = me.store;
		
		for (i=0; i < store.data.items.length; i++)
		{
			if (store.data.items[i].sel)
			{
				r.selected.push(store.data.items[i]);
			}
		}
		
		return r;
	},
	
	select: function(sel) {
		var me = this,
			store = me.store,
			i;
		
		for (i=0; i < sel.length; i++)
		{
			sel[i].select(1);
			
			if (me.selMode == "SINGLE")
			{
				break;
			}
		}
	},
	
	clearSelection: function() {
		var me = this,
			i,
			store = me.store;
		
		for (i=0; i < store.data.items.length; i++)
		{
			store.data.items[i].select(false);
		}
	},
	
	filter: function(filter) {
		var me = this,
			store = me.store;
		
		store.filter.call(store, filter);
	},
	
	sort: function(c) {
		var me = this,
			store = me.store;
			
		store.sort.call(store, c);
	},
	
	_uh/*updateHeader*/: function() {
		var me = this,
			i,
			c,
			_Gb = me._Gb,
			tr, th,
			columns = me.columns,
			store = me.store,
			flex_w = 0,
			fixed_w = 0,
			tw = me.getWidth(),
			thead,
			cc;
		
		for (i=0; i < columns.length; i++)
		{
			c = columns[i];
			
			if (c.flex)
			{
				flex_w += c.flex;
			}
			else if (c.width)
			{
				fixed_w += c.width;
			}
		}
		
		$.each(columns, function(n, col) {
			var cgroup = $("<colgroup></colgroup>").appendTo(_Gb),
				c = $("<col></col>").appendTo(cgroup),
				mw;
			
			col.__c = c;
			
			if (col.flex)
			{
				mw = (tw - fixed_w) * col.flex / flex_w;
			}
			else
			{
				mw = col.width;
			}
			
			c.css({width: mw});
		});
		
		thead = $("<thead></thead>").appendTo(_Gb);
		
		me.thead = thead;
		
		tr = $("<tr></tr>").appendTo(thead);
		
		$.each(columns, function(i, c) {
			var cc = c.xtype == "checkcolumn",
				th,
				imgc, img;
				
			if (cc && me.selMode == "MULTI")
			{
				th = $("<th></th>").appendTo(tr);
				
				imgc = $("<div class='igc-check-button'></div>").appendTo(th);
				img = $("<div class='igc-check-column'></div>").appendTo(imgc);
				me._tsmc = img;
				
				img.bind("click", function(e) {
					e.stopImmediatePropagation();
					e.preventDefault();
					
					me._tsm = !me._tsm;
					
					img[me._tsm ? "addClass" : "removeClass"]("igc-check-column-checked");
					
					store._u/*toggleSelection*/.call(store, me, me._tsm);
				});
			}
			else
			{
				th = $("<th class='igc-theader'><span>" + (c.text || "") + "</span>" + (cc ? "" : "<span class='sort'>&#9660;</span>") + "</th>").appendTo(tr);
			}
			
			c.d_th = {
				th: th,
				s: $(".sort", th)
			};
			
			if (!cc)
			{
				th.bind("mousedown", function(e) {
					// sort column
					c._sort = c._sort || {};
					c._sort.asc = !c._sort.asc;
					store.sort.call(store, c);
				});
			}
		});
	},
	
	_bc/*createComponent*/: function() {
		var me = this;
		
		me.body.dom.addClass("igc-grd-cnt");
		me._Gb = $("<table class='igc-grid'></table>").appendTo(me.body.dom);
		me.selMode = me.selMode || "SINGLE";
		
		if (me.store)
		{
			me.store.ownerCt = me;
			me.store = new IG$/*mainapp*/.pbgs/*gridstore*/(me.store);
		}
		
		me._uh/*updateHeader*/();
		
		if (me.viewConfig && me.viewConfig.plugins && me.viewConfig.plugins.ptype)
		{
			me.body.dom.droppable({
				drop: function(event, ui) {
					var d = $(ui.draggable).data("record"),
						r;
					
					if (d && me.viewConfig.listeners && me.viewConfig.listeners.drop)
					{
						r = me.viewConfig.listeners.drop.apply(me, [null, {records: [d]}, null, null]);
						if (r)
						{
							me.store.add(d.data);
						}
					}
				}
			});
		}
		
		IG$/*mainapp*/.pbg/*grid*/.superclass._bc/*createComponent*/.call(me);
	},
	_ic/*initComponent*/: function() {
		var me = this,
			i,
			item;
		
		IG$/*mainapp*/.pbg/*grid*/.superclass._ic/*initComponent*/.call(me);
	}
});

IG$/*mainapp*/.pbC/*combobox*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pb, {
	
	_bc/*createComponent*/: function() {
		var me = this;
		
		me._lbd = $("<div class='igc-inp-lbl'><span>" + (me.fieldLabel || "") + "</span></div>").appendTo(me.body.dom).hide();
		me._lip = $("<select class='igc-inp-tfield'></select>").appendTo(me.body.dom);
		
		me._lip.bind("change", function(e) {
			e.stopPropagation();
			e.preventDefault();
			
			me.fireEvent.call(me, "change");
		});
				
		if (me.store)
		{
			me.store.ownerCt = me;
			me.store = new IG$/*mainapp*/.pbgs/*gridstore*/(me.store);
		}
		
		IG$/*mainapp*/.pbC/*combobox*/.superclass._bc/*createComponent*/.call(me);
	},
	_ic/*initComponent*/: function() {
		var me = this,
			i,
			item;
		
		me.height = me.height || 26;
		
		IG$/*mainapp*/.pbC/*combobox*/.superclass._ic/*initComponent*/.call(me);
	}
});
var $s ={};

$s.ready = function(d) {
	if (window.Ext)
	{
		Ext.onReady(function() {
			Ext.tip.QuickTipManager.init();
			d.call();
		});
	}
}

if (window.Ext)
{ 
Ext.BLANK_IMAGE_URL = "./images/s.gif";
$s.baseCSSPrefix = Ext.baseCSSPrefix;

$s.panel = Ext.panel.Panel;

$s.viewport = Ext.Viewport;

$s.extend = Ext.extend;

$s.treepanel = Ext.tree.Panel;
$s.gridpanel = Ext.grid.Panel;
$s.tabpanel = Ext.tab.Panel;
$s.view = Ext.view.View;

$s.menu = Ext.menu.Menu;

$s.apply = Ext.apply;

$s.window = Ext.Window;
$s.dropzone = Ext.dd.DropZone;
$s.formpanel = Ext.form.Panel;
$s.combobox = Ext.form.field.ComboBox;

$s.create = Ext.create;

}

IG$/*mainapp*/._I51/*ShowErrorMessage*/ = function(doc, parent, params) {
	var root = IG$/*mainapp*/._I18/*XGetNode*/(doc, "/smsg"),
		errcode = IG$/*mainapp*/._I1b/*XGetAttr*/(root, "errorcode"),
		errdesc = IG$/*mainapp*/._I1b/*XGetAttr*/(root, "errormsg"),
		dnode = IG$/*mainapp*/._I18/*XGetNode*/(root, "detail"),
		errmsg = dnode ? IG$/*mainapp*/._I24/*getTextContent*/(dnode) : null,
		snode = IG$/*mainapp*/._I18/*XGetNode*/(root, "stacktrace"),
		errstack = snode ? IG$/*mainapp*/._I24/*getTextContent*/(snode) : null,
		pop,
		merror = false;
		
	switch (errcode)
	{
	case "0x7500":
	case "0x6d00":
		merror = true;
		break;
	}
	
	if (merror == false && (errmsg || errstack || params))
	{
//		pop = new IG$/*mainapp*/.E5a/*ErrorDialog*/({
//			a1/*messagecontent*/: {
//				errdesc: errdesc,
//				errmsg: errmsg,
//				errstack: errstack,
//				params: params
//			}
//		});
//		pop.show();

		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, errdesc + "<br/>\n\n" + (errmsg || ""), null, parent, 1, "error", null, {
			errdesc: errdesc,
			errmsg: errmsg,
			errstack: errstack,
			params: params
		});
	}
	else
	{
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, errdesc + "\n\n" + (errmsg || ""), null, parent, 1, "error");
	}
}

IG$/*mainapp*/._I52/*ShowError*/ = function(errdesc, parent) {
	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, errdesc, null, parent, 1, "error");
}

IG$/*mainapp*/._I53/*ShowConnectionError*/ = function(panel) {
	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_ERR_CONNECT'), null, panel, 1, "error");
	//history.back(-1);
}

IG$/*mainapp*/._I_5/*checkLogin*/ = function(panel, dlg, func) {
	var req = new IG$/*mainapp*/._I3e/*requestServer*/();
	
	if (panel && panel.setLoading)
	{
		panel.setLoading(true);
	}
	
	req.checklogin = true;
	
	req.init(panel, 
		{
            ack: '34',
        	payload: IG$/*mainapp*/._I2d/*getItemAddress*/({}),
            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({})
        }, panel, function(xdoc) {
        	if (panel && panel.setLoading)
			{
				panel.setLoading(false);
			}
			
        	if (dlg)
        	{
        		dlg.show();
        	}
        	
        	if (func)
        	{
        		func.call(panel);
        	}
        });
	req._l/*request*/();
}

if (IG$/*mainapp*/.pb)
{
	IG$/*mainapp*/.E5a/*ErrorDialog*/ = IG$/*mainapp*/.x_c/*extend*/(IG$/*mainapp*/.pb, {
		xtype: "panel",
		modal: true,
		region:'center',
		
		"layout": 'fit',
		
		closable: false,
		resizable:false,
		constrain: true,
		constrainHeader: true,
		
		callback: null,
		ignoreHeaderBorderManagement: true,
		frame: false,
		width: 300,
		height: 350,
		
		_ic/*initComponent*/ : function() {
			var me = this,
				msg = me.a1/*messagecontent*/,
				param = "",
				k;
			
			if (msg.params)
			{
				for (k in msg.params)
				{
					if (param)
					{
						param += "\n";
					}
					
					param += k + ": " + Base64.encode(msg.params[k]);
				}
				
				param += "\n\n";
				
				if (msg.errstack)
				{
					param += "stacktrace :" + msg.errstack + "\n";
				}
			}
			else
			{
				param = "stacktrace : " + msg.errstack + "\n";
			}
			
			msg.errstack = param;
			
			IG$/*mainapp*/.apply(this, {
				title: "Server Message",
				items: [
					{
						xtype: "container",
						name: "m_msg",
						border: 0,
						layout: "fit",
						listeners: {
							afterrender: function(tobj) {
								var m_msg = me.down("[name=m_msg]"),
									m_msg_body = m_msg.body.dom,
									mbody;
									
								m_msg_body.empty();
								
								mbody = $("<div class='ing-error-dlg'></div>").appendTo(m_msg_body)
								
								mbody.append("<div class='ing-error-desc'>" + msg.errdesc + "</div>");
								
								if (msg.errmsg)
								{
									mbody.append("<div class='ing-error-msg'>" + msg.errmsg + "</div>");
								}
								
								if (msg.errstack)
								{
									mbody.append("<div class='ing-error-stack'><span>" + param + "</span></div>");
								}
							}
						}
					}
				],
				
				buttons: [
					{
						text: IRm$/*resources*/.r1("B_CLOSE"),
						handler: function() {
							this.close();
						},
						scope: this
					}
				]
			});
			IG$/*mainapp*/.E5a/*ErrorDialog*/.superclass._ic/*initComponent*/.apply(this, arguments);
		}
	});
}

IG$/*mainapp*/._I54/*alertmsg*/ = function(title, msg, fn, parent, ismodal, mtype, stack, a1/*messagecontent*/, btn) {
//	if (ismodal == 2)
//	{
//		var msgbox = new Ext.window.MessageBox(),
//			config = {
//			title : title || ig$/*appoption*/.appname,
//	        msg : msg,
//	        buttons: msgbox.OK,
//	        fn: fn || null,
//	        scope : null,
//	        minWidth: msgbox.minWidth,
//	        modal: true,
//	        animateTarget: (parent && parent.el) ? parent.el.dom : (parent && parent.body) ? parent.body.dom : null
//		};
//		
//		msgbox.show(config);
//		
//		return;
//	}

	if (ismodal == 2)
	{
		btn = 1;
	}

	var body = $("body"),
		msgbox = $("<div class='igc-alert-cnt'>" + (ismodal ? "<div class='igc-alert-bg'></div>" : "") + "<div class='igc-alert-body'></div></div>").appendTo(body),
		mbody = $(".igc-alert-body", msgbox),
		bbox,
		bclose, bdetail,
		h = IRm$/*resources*/.r1("M_UNKNOWN"),
		pd = "", k,
		msgpop,
		binfo = "", bk,
		browser = window.bowser;
		
	mtype = mtype || "warning";
	
	switch (mtype)
	{
	case "error":
		h = IRm$/*resources*/.r1("M_ERROR");
		break;
	case "warning":
		h = IRm$/*resources*/.r1("M_WARNING");
		break;
	case "info":
		h = IRm$/*resources*/.r1("M_INFO");
		break;
	case "success":
		h = IRm$/*resources*/.r1("M_SUCCESS");
		break;
	}
	
	if (a1/*messagecontent*/)
	{
		if (a1/*messagecontent*/.params)
		{
			for (k in a1/*messagecontent*/.params)
			{
				if (pd)
				{
					pd += "\n";
				}
				
				pd += k + ": " + Base64.encode(a1/*messagecontent*/.params[k]);
			}
			
			pd += "\n\n";
			
			if (a1/*messagecontent*/.errstack)
			{
				pd += "stacktrace :" + a1/*messagecontent*/.errstack + "\n";
			}
		}
		else
		{
			pd = "stacktrace : " + a1/*messagecontent*/.errstack + "\n";
		}
		
		if (pd && browser)
		{
			for (bk in browser)
			{
				if (typeof(browser[k]) == "function")
					continue;
					
				binfo += k + ": " + browser[k] + "\n";
			}
			
			pd = binfo + "\n\n" + pd;
		}
	}
		
	bbox = $("<div class='igc-alert'><a class='close'>&#215;</a><div class='detail' style='display: none'>" + IRm$/*resources*/.r1("M_DETAIL") + "</div><h4 class='alert-heading'>" + h + "</h4><span>" + msg + "</span></div>").appendTo(mbody);
	bclose = $(".close", bbox)[btn ? "hide" : "show"]();
	bdetail = $(".detail", bbox);
	
	pd && bdetail.show();
	
	bbox.addClass("igc-alert-" + mtype);
	
	bdetail.bind("click", function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		
		msgpop = new IG$/*mainapp*/.E5a/*ErrorDialog*/({
			renderTo: msgbox,
			a1/*messagecontent*/: a1/*messagecontent*/
		});
		msgpop.setPosition((msgbox.width() - msgpop.width) / 2, (msgbox.height() - msgpop.height) / 2);
		msgpop.setSize(msgpop.width, msgpop.height);
		msgpop.show();
	});
	
	bclose.bind("click", function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		msgpop && msgpop.close();
		msgbox.fadeOut(function() {
			if (fn)
			{
				fn.call(parent);
			}
			msgbox.remove();
		});
	});
	
	if (!btn)
	{
		bbox.bind("click", function(e) {
			e.preventDefault();
			e.stopImmediatePropagation();
			msgpop && msgpop.close();
			msgbox.fadeOut(function() {
				if (fn)
				{
					fn.call(parent);
				}
				msgbox.remove();
			});
		});
	}
	else
	{
		var dbtn,
			dbtnsul,
			btns = [];
		
		if (btn == 6 || btn == 14)
		{
			btns.push({
				text: IRm$/*resources*/.r1("B_YES"),
				bseq: 2,
				dlg: "yes"
			});
			
			btns.push({
				text: IRm$/*resources*/.r1("B_NO"),
				bseq: 4,
				dlg: "no"
			});
			
			if (btn == 14)
			{
				btns.push({
					text: IRm$/*resources*/.r1("B_CANCEL"),
					bseq: 8,
					dlg: "cancel"
				});
			}
		}
		else if (btn == 1 || btn == 9)
		{
			btns.push({
				text: IRm$/*resources*/.r1("B_OK"),
				bseq: 1,
				dlg: "ok"
			});
			
			if (btn == 9)
			{
				btns.push({
					text: IRm$/*resources*/.r1("B_CANCEL"),
					bseq: 8,
					dlg: "cancel"
				});
			}
		}
		
		dbtn = $("<div class='igc-alert-buttons'><ul></ul></div>").appendTo(bbox);
		dbtnsul = $("ul", dbtn);
		
		$.each(btns, function(i, m) {
			var dp = $("<li></li>").appendTo(dbtnsul);
				d = $("<div class='igc-button'>" + m.text + "</div>").appendTo(dp);
				
			d.bind("click", function(e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				msgpop && msgpop.close();
				msgbox.fadeOut(function() {
					if (fn)
					{
						fn.call(parent, m.dlg);
					}
					msgbox.remove();
				});
			});
		});
	}
	
	if (!ismodal)
	{
		msgbox.addClass("igc-no-modal");
		
		setTimeout(function() {
			msgpop && msgpop.close();
			
			msgbox.fadeOut(function() {
				if (fn)
				{
					fn.call(parent);
				}
				msgbox.remove();
			});
		}, 1500);
	}
}

IG$/*mainapp*/._I55/*confirmMessages*/ = function(title, msg, fn, parent, owner, btn) {
	// title, msg, fn, parent, ismodal, mtype, stack, a1/*messagecontent*/
	IG$/*mainapp*/._I54/*alertmsg*/(
		title || IRm$/*resources*/.r1("L_SAVE_CHANGES"),
		msg || IRm$/*resources*/.r1("L_SAVE_C_MSG"),
		fn,
		owner,
		1,
		"info",
		null, null, btn || 6);
		
//	var msgbox = new Ext.window.MessageBox();
//	var config = {
//		title : title || IRm$/*resources*/.r1("L_SAVE_CHANGES"), // "Save Changes?",
//        msg : msg || IRm$/*resources*/.r1("L_SAVE_C_MSG"),
//        buttons: btn || Ext.Msg.YESNO,
//        icon: Ext.Msg.QUESTION,
//        fn: fn || null,
//        scope : owner || null,
//        minWidth: msgbox.minWidth,
//        modal: true,
//        animateTarget: (parent && parent.el) ? parent.el.dom : (parent && parent.body) ? parent.body.dom : null
//	};
//	
//	msgbox.show(config);
}

IG$/*mainapp*/._I56/*checkLock*/ = function(panel, frun) {
	var creq = new IG$/*mainapp*/._I3e/*requestServer*/();
	creq.init(panel, 
		{
            ack: "11",
            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'lock', detail: "check"})
		}, panel, function(xdoc) {
			var lnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/Lock"),
				lparam;
			if (lnode)
			{
				lparam = IG$/*mainapp*/._I1c/*XGetAttrProp*/(lnode);
				var lwin = new IG$/*mainapp*/._I58/*LockWindow*/({
					lparam: lparam,
					callback: new IG$/*mainapp*/._I3d/*callBackObj*/(panel, function(cmd) {
						if (cmd == "unlock")
						{
							frun.call(panel, cmd);
						}
						else
						{
							frun.call(panel, cmd);
						}
					})
				});
				lwin.show(panel);
			}
			else
			{
				var lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
				lreq.init(panel, 
					{
			            ack: "11",
			            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
			            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'lock', detail: "set"})
					}, panel, function(xdoc) {
						
					}, false);
					
				lreq._l/*request*/();
			}
		}, false);
		
	creq._l/*request*/();
}

if (window.Ext)
{
	IG$/*mainapp*/._I57/*IngPanel*/ = Ext.extend(Ext.panel.Panel, {
		frameHeader: false,
		
		initComponent: function() {
			this.on("destroy", function(tobj, eopts) {
				tobj.__dx = true;
			});
			
			IG$/*mainapp*/._I57/*IngPanel*/.superclass.initComponent.call(this);
		},
		
		destroy: function() {
			var me = this;
			me.__dx = true;
			setTimeout(function() {
				IG$/*mainapp*/._I57/*IngPanel*/.superclass.destroy.call(me);
			}, 10);
		},
		
		setLoading: function(load, targetEl) {
			var me = this,
	            config,
	            mask, moff, toff,
	            mdom;
	            
	        if (me.rendered) 
	        {
	           	Ext.destroy(me.loadMask);
	            me.loadMask = null;
	            
	            if (me.rendermask)
	        	{
	        		me.rendermask.empty();
	        		me.rendermask.hide();
	        	}
	
	            if (load !== false && !me.collapsed) 
	            {
	                if (Ext.isObject(load)) 
	                {
	                    config = Ext.apply({}, load);
	                } 
	                else if (Ext.isString(load)) 
	                {
	                    config = {msg: load};
	                } 
	                else 
	                {
	                    config = {};
	                }
	                
	                if (me.rendermask)
	                {
	                	mdom = $(me.el.dom);
		                me.rendermask.show();
		                me.rendermask.empty();
		                moff = $(mdom.parent()).offset();
		                toff = mdom.offset();
		                me.rendermask.css({top: toff.top - moff.top});
		                
	                }
	                
	                if (targetEl) 
	               	{
	               		
	                    Ext.applyIf(config, {
	                        useTargetEl: true
	                    });
	                }
	                me.loadMask = new Ext.LoadMask((me.rendermask ? me.rendermask[0] : null) || me, config);
	                me.loadMask.show(me.ownerCt);
	            }
	        }
			return me.loadMask;
		}
	});
}

if (window.Ext)
{
	IG$/*mainapp*/._I58/*LockWindow*/ = $s.extend($s.window, {
		modal: true,
		region:'center',
		
		"layout": 'fit',
		
		closable: false,
		resizable:false,
		
		width: 300,
		autoHeight: true,
		
		callback: null,
		
		_IG0/*closeDlgProc*/: function(cmd) {
			this.callback && this.callback.execute(cmd);
			
			this.close();
		},
		
		initComponent : function() {
			var panel = this;
			
			panel.title = IRm$/*resources*/.r1('M_LOCK_TITLE');
			
			$s.apply(this, {
				defaults:{bodyStyle:'padding:10px'},
				
				items: [
				    {
				    	xtype: "displayfield",
				    	name: "txtlock",
				    	padding: 10,
				    	value: ""
				    }
				],
				
				buttons:[
					{
						text: IRm$/*resources*/.r1('B_UNLOCK'),
						handler: function() {
							var lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
							lreq.init(panel, 
								{
						            ack: "11",
						            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({uid: panel.uid}),
						            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: 'lock', detail: "unlock"})
								}, panel, function(xdoc) {
									panel._IG0/*closeDlgProc*/.call(panel, "unlock");
								}, false);
								
							lreq._l/*request*/();
						},
						scope: this
					},
					{
						text: IRm$/*resources*/.r1('B_CLOSE'),
						handler: function() {
							this._IG0/*closeDlgProc*/("close");
						},
						scope: this
					}
				],
				
				listeners: {
					afterrender: function(ui) {
						var txtlock = this.down("[name=txtlock]"),
							lparam = this.lparam || {};
							
						this.uid = lparam.uid;
						
						txtlock.setValue(IRm$/*resources*/.r1("M_LOCK_MSG", [lparam.username + "(" + lparam.userid + ")", IG$/*mainapp*/._I40/*formatDate*/(lparam.date)]));
					}
				}
			});
			
			IG$/*mainapp*/._I58/*LockWindow*/.superclass.initComponent.apply(this, arguments);
		}
	});
}

if (window.Ext)
{
	// fix hide submenu (in chrome 43)
	Ext.override(Ext.menu.Menu, {
	    onMouseLeave: function(e) {
	    var me = this;
	
	
	    // BEGIN FIX
	    var visibleSubmenu = false;
	    me.items.each(function(item) { 
	        if(item.menu && item.menu.isVisible()) { 
	            visibleSubmenu = true;
	        }
	    })
	    if(visibleSubmenu) {
	        //console.log('apply fix hide submenu');
	        return;
	    }
	    // END FIX
	
	
	    me.deactivateActiveItem();
	
	
	    if (me.disabled) {
	        return;
	    }
	
	
	    me.fireEvent('mouseleave', me, e);
	    }
	});
}

IG$/*mainapp*/.m2ER = function() {
	var fields = [];
	var config = {
		type: 'xml',
		root: 'smsg',
		record: 'item',
		success: '@success'
	}
	IG$/*mainapp*/.m2ER.superclass.constructor.call(this, config, fields);
};

window.Ext && Ext.extend(IG$/*mainapp*/.m2ER, Ext.data.reader.Xml, {
	readRecords: function (doc) {
		this.xmlData = doc;
		var node = IG$/*mainapp*/._I18/*XGetNode*/(doc, "/smsg/item");
		
		if (node)
		{
			records = this.extractData(node);
			recordCount = records.length;
		}
		else
		{
			recordCount = 0;
			records = [];
		}
		
		var ret = Ext.create('Ext.data.ResultSet', {
			total: recordCount,
			count: recordCount,
			records: records,
			success: true,
			message: null
		});
		
		return ret;
	},
	
	read: function(response) {
		var doc = response.responseXML;
		if(!doc) {
			throw {message: "XmlReader.read: XML Document not available"};
		}
		this.xmlData = doc;
		return this.readRecords(doc);
	}
});

// splitter between docking items

IG$/*mainapp*/.sp/*docksplit*/ = function(config) {
	var me = this;
	
	me.p1/*docmain*/ = config.docmain;
	me.p2/*panel*/ = config.panel;
	me.p5/*direction*/ = config.direction;
	
	me.p6/*_initPos*/ = null;
	me.p7/*_ghost*/ = null;
	
	me.l1/*init*/();
}

IG$/*mainapp*/.sp/*docksplit*/.prototype = {
	l1/*init*/: function() {
		var me = this,
			cursor = me.p5/*direction*/ == "horizontal" ? "n-resize" : "e-resize";
			
		me.spui = $("<div class='dock-splitter'></div>")
			.attr({unselectable:"on"})
			.css({position: "absolute"})
			.appendTo(me.p1/*domain*/.b1/*box*/)
			.hide();
			
		me.p2/*panel*/._SP = me.p2/*panel*/._SP || [];
		me.p2/*panel*/._SP.push(me);
		
		if (!ig$/*appoption*/._fix_split)
		{
			me.spui.css({cursor: cursor, "user-select": "none", "-webkit-user-select": "none","-khtml-user-select": "none", "-moz-user-select": "none"});
			me.spui.bind("mousedown", function(event) {
				me.l2/*_startDrag*/.call(me, event);
			});
		}
		else
		{
			me.spui.css({"backgroundColor": "transparent"});
		}
	},
	
	setV: function(v) {
		var me = this;
		
		if (v && !ig$/*appoption*/._fix_split)
		{
			me.spui.show();
		}
		else
		{
			me.spui.hide();
		}
	},
	
	l2/*_startDrag*/: function(event) {
		var me = this;
		
		if(event.target != me.spui[0])
			return;
			
		event.stopPropagation();
		event.preventDefault();
		
		me.p7/*_ghost*/ = me.p7/*_ghost*/ || me.spui.clone(false).appendTo(me.p1/*domain*/.b1/*box*/);
		me.p7/*_ghost*/.css("-webkit-user-select", "none")
		me.p8/*_poff*/ = me.p1/*domain*/.b1/*box*/.offset();
		me.p6/*_initPos*/ = me.spui.position();

		function __doDrag(event) {
			event.stopPropagation();
			event.preventDefault();
			me.l3/*_doDrag*/.call(me, event);
		}
		
		function __endDrag(event) {
			event.stopPropagation();
			event.preventDefault();
			me.l4/*_endDrag*/.call(me, event);
			
			$(document).unbind("mousemove", __doDrag).unbind("mouseup", __endDrag);
		}
		
		$(document)
			.bind("mousemove", __doDrag)
			.bind("mouseup", __endDrag);
	},
	
	l3/*_doDrag*/: function(event) {
		var me = this,
			incr;
			
		if (!me.p7/*_ghost*/) 
			return;
		
		event.stopPropagation();
			
		if (me.p5/*direction*/ == "horizontal")
		{
			incr = event.pageY - me.p6/*_initPos*/.top - me.p8/*_poff*/.top;
			me.p7/*_ghost*/.css({top: me.p6/*_initPos*/.top + incr});
		}
		else
		{
			incr = event.pageX - me.p6/*_initPos*/.left - me.p8/*_poff*/.left;
			me.p7/*_ghost*/.css({left: me.p6/*_initPos*/.left + incr});
		}
	},
	
	l4/*_endDrag*/: function(event) {
		event.stopPropagation();
		
		if (!this.p7/*_ghost*/)
			return;
		
		var me = this,
			g = me.p7/*_ghost*/,
			goff = g.offset(),
			moff = me.p1/*domain*/.b1/*box*/.offset(),
			p = {
				left: goff.left - moff.left,
				top: goff.top - moff.top
			},
			incr, i, flsize = 0, fisize = 0,
			arr,
			base1 = (me.p5/*direction*/ == "horizontal" ? "top" : "left"),
			base2 = (me.p5/*direction*/ == "horizontal" ? "height" : "width"),
			base3 = (me.p5/*direction*/ == "horizontal" ? "h" : "w"),
			pnl,
			qindex = -1,
			pbefore,
			p2/*panel*/ = me.p2/*panel*/,
			_pi = 0;
			_pitem = p2/*panel*/.parent,
			mval = 40;
		
		incr = p[base1] - me.p6/*_initPos*/[base1];
		
		for (i=0; i < _pitem.children.length; i++)
		{
			if (_pitem.children[i] == p2/*panel*/)
			{
				_pi = i;
				break;
			}
		}
		
		pbefore = _pitem.children[_pi-1];
		
		if (p2/*panel*/.lt.pos[base3] - incr < mval)
		{
			incr = p2/*panel*/.lt.ubody[base3] - mval;
		}
		
		if (pbefore.lt.pos[base2] + incr < mval)
		{
			incr = mval - pbefore.lt.pos[base3];
		}
		
		pbefore.lt.pos[base3] = pbefore.lt.pos[base3] + incr;
		p2/*panel*/.lt.pos[base3] = p2/*panel*/.lt.pos[base3] - incr;
		
		pbefore.lt.ubody.lt[base3] = pbefore.lt.pos[base3];
		p2/*panel*/.lt.ubody.lt[base3] = p2/*panel*/.lt.pos[base3];
		
		me.p7/*_ghost*/.remove(); 
		me.p7/*_ghost*/ = null;	
		
		me.p1/*docmain*/.A/*resizeContainer*/.call(me.p1/*domain*/, [pbefore, p2/*panel*/]);
		
		me.p1/*docmain*/._IM5/*updateDisplay*/.call(me.p1/*docmain*/, true);
	},
	
	l5/*remove*/: function() {
		var me = this;
		me.spui.remove();
	},
	
	l6/*validate*/: function() {
		var me = this,
			p5/*direction*/ = me.p5/*direction*/,
			gap = 1, m = 1,
			px=0, py=0, pw=0, ph=0,
			mx, my, mw, mh,
			i,
			panel = me.p2/*panel*/,
			pos,
			ubody = panel.lt.ubody;
		
		if (panel)
		{
			pos = panel.lt.pos;
			
			switch (me.p5/*direction*/)
			{
			case "vertical":
				px = pos.x;
				py = pos.y;
				pw = gap * 2;
				ph = pos.h;
				break;
			case "horizontal":
				px = pos.x;
				py = pos.y;
				pw = pos.w;
				ph = gap * 2;
				break;
			}
				
			me.spui.css({top: py, left: px, width: pw, height: ph});
		}
	}
}
IG$/*mainapp*/.di/*dropItem*/ = function(owner, docid, config) {
	var me = this,
		btnarea;
	
	me.owner = owner;
	me.container = false;
	me.showtitle = true;
	me._v = true;
	me.visible = true;
	
	me.x = (config && config.x) ? config.x : null;
	me.y = (config && config.y) ? config.y : null;
	me.width = (config && config.width) ? config.width : null;
	me.height = (config && config.height) ? config.height : null;
	me.fw/*fixedwidth*/ = false;
	me.fh/*fixedheight*/ = false;
	me.hidetitle = false;
	// me.playout = "V";

	me.docid = docid;
	me.activeTab = 0;
	me.dragging = false;
	
	me.b1/*box*/ = $("<div class='idv-dk-main' " + docid + "></div>").css({
		position: "absolute", 
		width: (IG$/*mainapp*/.x_10/*jqueryExtension*/._w(owner.b1/*box*/) || 100), 
		height: (IG$/*mainapp*/.x_10/*jqueryExtension*/._h(owner.b1/*box*/) || 100)
	}).dselect();
	me.binner = $("<div class='dock_inner'></div>").appendTo(me.b1/*box*/).dselect();
	me.b2/*boxtitle*/ = $("<div class='dock_title doc_title_normal'></div>").appendTo(me.binner).dselect();
	$("<div class='dock_title_icon'></div>").appendTo(me.b2/*boxtitle*/);
	$("<div class='dock_title_text'><span id='dock_title_text'>&nbsp;</span></div>").appendTo(me.b2/*boxtitle*/);
	me.btnarea = btnarea = $("<div class='dock_title_btnarea'></div>").appendTo(me.b2/*boxtitle*/);
	
	me.btnmap = {};
	
	me.b3/*boxcontent*/ = $("<div class='dock_content'></div>").appendTo(me.binner).dselect();
	
	config = config || {};
	config.draggable != false && me.b1/*box*/.draggable({
		handle: me.b2/*boxtitle*/,
		
		delay: 300,
		distance: 5,
		zIndex: 99,
		
		start: function(event, ui) {
			if (!owner.editmode)
				return false;
				
			me.dragging = true;
			owner.l3/*showDropProxy*/.call(owner, event, ui);
		},
		drag: function(event, ui) {
			owner.l17/*dragOver*/.call(owner, event, ui);
		},
		stop: function(event, ui) {
			owner.l18/*dragStop*/.call(owner, event, ui);
			me.dragging = false;
		}
	});
	
	me.b1/*box*/.bind("resize", function() {
		me.l2/*resizeH*/.call(me);
	});
	
	me._dzid = me.owner._dzid + "_" + me.docid;

	me.l2/*resizeH*/();
	
	if (config)
	{
		me.fw/*fixedwidth*/ = typeof(config.fw/*fixedwidth*/) != "undefined" ? config.fw/*fixedwidth*/ : me.fw/*fixedwidth*/;
		me.fh/*fixedheight*/ = typeof(config.fh/*fixedheight*/) != "undefined" ? config.fh/*fixedheight*/ : me.fh/*fixedheight*/;
		me.showtitle = !config.hidetitle;
		me.showTitle(me.showtitle);
		me.setTitle(config.title);
		me.objtype = me.objtype || config.objtype;
	}
	
	me.l1/*init*/();
}

IG$/*mainapp*/.di/*dropItem*/.prototype = {
	m1/*validateProperty*/: function() {
		var me = this;
		
		switch (me.objtype)
		{
		case "SHEET":
		case "FILTER":
		case "TEXT":
		case "RPT_VIEW":
			me.container = false;
			me.children = [];
			break;
		case "PANEL":
		case "_dc":
		case "TAB":
			me.container = true;
			me._direction = 0; // 0 : horizontal, 1 : vertical
			me.children = [];
			break;
		}
	},
	
	getTitle: function() {
		var me = this,
			tdiv = $("#dock_title_text", me.b2/*boxtitle*/);
		
		var r = tdiv.text();
		
		if (r == " ")
			r = "";
		
		return r;
	},
	
	b/*setButtons*/: function(btns) {
		var me = this,
			mbtns = btns || [],
			owner = me.owner,
			btnarea = me.btnarea,
			btnmap,
			sheet_toolbar = ig$/*appoption*/.sheet_toolbar,
			i;
		
		btnmap = me.btnmap = {};
		btnarea.empty();
		
		if (me.objtype == "SHEET")
		{
			mbtns.push({
				name: "viewgrid",
				hidden: true,
				cls: "idv-dk-btn-vgrid",
				handler: function(panel) {
					var p = this;
					p.view._II9/*updateViewMode*/.call(p.view, "grid");
				},
				scope: me
			});
		
			mbtns.push({
				name: "viewchart",
				hidden: true,
				cls: "idv-dk-btn-vchart",
				handler: function(panel) {
					var p = this;
					p.view._II9/*updateViewMode*/.call(p.view, "chart");
				},
				scope: me
			});

			mbtns.push({
				name: "viewrstat",
				hidden: true,
				cls: "idv-dk-btn-vrstat",
				handler: function(panel) {
					var p = this;
					p.view._II9/*updateViewMode*/.call(p.view, "r");
				},
				scope: me
			});
		}
		
		mbtns.push({
			name: "exp_excel",
			hidden: true,
			cls: "idv-dk-btn-e-xls",
			handler: function(panel) {
				var p = this;
				p.view.exportSheet.call(p.view, "EXCEL");
			},
			scope: me
		});

		mbtns.push({
			name: "exp_pdf",
			hidden: true,
			cls: "idv-dk-btn-e-pdf",
			handler: function(panel) {
				var p = this;
				p.view.exportSheet.call(p.view, "PDF");
			},
			scope: me
		});
		
		mbtns.push({
			name: "jasper_excel",
			hidden: true,
			cls: "idv-dk-btn-e-xls",
			handler: function(panel) {
				var p = this;
				p.view.exportSheet.call(p.view, "JASPER_EXCEL");
			},
			scope: me
		});

		mbtns.push({
			name: "jasper_pdf",
			hidden: true,
			cls: "idv-dk-btn-e-pdf",
			handler: function(panel) {
				var p = this;
				p.view.exportSheet.call(p.view, "JASPER_PDF");
			},
			scope: me
		});
		
		mbtns.push({
			name: "jasper_ppt",
			hidden: true,
			cls: "idv-dk-btn-e-pdf",
			handler: function(panel) {
				var p = this;
				p.view.exportSheet.call(p.view, "JASPER_PPT");
			},
			scope: me
		});
		
		mbtns.push({
			name: "jasper_docx",
			hidden: true,
			cls: "idv-dk-btn-e-pdf",
			handler: function(panel) {
				var p = this;
				p.view.exportSheet.call(p.view, "JASPER_DOCX");
			},
			scope: me
		});
		
		mbtns.push({
			name: "jasper_rtf",
			hidden: true,
			cls: "idv-dk-btn-e-pdf",
			handler: function(panel) {
				var p = this;
				p.view.exportSheet.call(p.view, "JASPER_RTF");
			},
			scope: me
		});
		
		mbtns.push({
			name: "jasper_html",
			hidden: true,
			cls: "idv-dk-btn-e-pdf",
			handler: function(panel) {
				var p = this;
				p.view.exportSheet.call(p.view, "JASPER_HTML");
			},
			scope: me
		});
		
		mbtns.push({
			name: "office_0",
			hidden: true,
			cls: "idv-dk-btn-e-off-0",
			handler: function(panel) {
				var p = this;
				p.view.exportSheet.call(p.view, "OFFICE_0");
			},
			scope: me
		});
		
		mbtns.push({
			name: "office_1",
			hidden: true,
			cls: "idv-dk-btn-e-off-1",
			handler: function(panel) {
				var p = this;
				p.view.exportSheet.call(p.view, "OFFICE_1");
			},
			scope: me
		});
		
		mbtns.push({
			name: "office_2",
			hidden: true,
			cls: "idv-dk-btn-e-off-1",
			handler: function(panel) {
				var p = this;
				p.view.exportSheet.call(p.view, "OFFICE_2");
			},
			scope: me
		});
		
		mbtns.push({
			name: "office_3",
			hidden: true,
			cls: "idv-dk-btn-e-off-1",
			handler: function(panel) {
				var p = this;
				p.view.exportSheet.call(p.view, "OFFICE_3");
			},
			scope: me
		});
		
		mbtns.push({
			name: "exp_csv",
			hidden: true,
			cls: "idv-dk-btn-e-csv",
			handler: function(panel) {
				var p = this;
				p.view._IP6/*downloadAllCSV*/.call(p.view, "CSV");
			},
			scope: me
		});
		
		if (ig$/*appoption*/.features && ig$/*appoption*/.features.ml && me.objtype == "SHEET")
		{
			mbtns.push({
				name: "ml_learn",
				cls: "ig_ml_learn",
				hidden: false,
				handler: function(panel) {
					var p = this;
					p.view._Ip7/*ml_learn*/.call(p.view);
				}
			});
		}
		
		if (sheet_toolbar && sheet_toolbar.length)
		{
			$.each(sheet_toolbar, function(i, btn) {
				mbtns.push({
					name: btn.key,
					label: btn.label,
					hidden: true,
					cls: btn.cls,
					handler: function(panel) {
						try
						{
							if (btn.handler)
							{
								btn.handler.call(btn.scope || me.view, me.view, btn.key);
							}
						}
						catch (e)
						{
						}
					},
					scope: me
				});
			});
		}
		
		mbtns.push({
			name: "pivot",
			cls: "icon-toolbar-pivot",
			hidden: true,
			handler: function(panel) {
				var p = this.owner;
				p.l8c/*configDock*/.call(p, panel.docid, 2);
			}
		});

		mbtns.push({
			name: "config",
			hidden: true,
			cls: "idv-dk-btn-cnf",
			handler: function(panel) {
				var p = this.owner;
				
				p.l8c/*configDock*/.call(p, panel.docid, 0);
			},
			scope: me
		});
		
		mbtns.push({
			name: "maximize",
			cls: "dock_maximize_button",
			handler: function(panel) {
				var p = this.owner;
				p.l8M/*maximizeDock*/.call(p, panel.docid);
			},
			scope: me
		});
		
		mbtns.push({
			name: "close",
			hidden: true,
			cls: "dock_close_button",
			handler: function(panel){
				var p = this.owner;
				p.l8a/*closeDock*/.call(p, panel.docid);
			},
			scope: me
		});
		
		$.each(mbtns, function(i, btn) {
			var el = $("<div class='dock_button " + (btn.cls || "") + "'></div>").appendTo(btnarea).dselect();
			btn.el = el;
			if (btn.label)
			{
				el.append("<span>" + btn.label + "</span>");
			}
			btn.el[btn.hidden == true ? "hide" : "show"]();
			btnmap[btn.name || "btn_" + i] = btn;
			el.bind("click", function(ev) {
				if (btn.handler)
				{
					btn.handler.call(btn.scope || me, me);
				}
				else
				{
					me.b1/*box*/.trigger("buttonclick", {
						panel: me,
						button: btn
					});
				}
			});
		});
	},
	dD/*dropIn*/: function(m) {
		var me = this,
			owner = me.owner,
			binner = me.binner,
			x = 5,
			y = 5,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(binner) - 10,
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(binner) - 10;
			
		switch (m)
		{
		case "right":
			x = w / 2;
		case "left":
			w = w / 2;
			break;
		case "bottom":
			y = h / 2;
		case "top":
			if (m == "top")
			{
				y += 20;
			}
			h = h / 2;
			break;
		case "inner":
			break;
		}
		
		owner.sd/*showdrop*/.call(owner, me, {
			top: y,
			left: x,
			width: w,
			height: h
		}, m);
	},
	dDs/*dropOut*/: function() {
		var me = this;
		me.owner.sdph/*hidedropproxy*/.call(me.owner, me);
	},
	
	dx/*dropHit*/: function(pox, getpos, psearch, gap) {
		var me = this,
			_pc = me._pc,
			pp,
			r,
			px = {
				x: pox.x + gap.left,
				y: pox.y + gap.top
			},
			mh, mw,
			padding = 0,
			margin = 0,
			bbox = me.bbox,
			sx, sy, tx, ty;
		
		// margin = psearch ? 0.4 : margin;
		
		if (bbox.x < px.x && px.x < bbox.x + bbox.w && bbox.y < px.y && px.y < bbox.y + bbox.h)
		{
			r = "none";
			
			if (getpos && me.objtype != "_dc")
			{
				pp = _pc.parent;
				
				while (pp)
				{
					if (pp.objtype == "PANEL" || pp.objtype == "TAB")
					{
						padding += 20;
					}
					
					pp = pp.parent;
					
					if (pp && pp == pp.parent)
					{
						break;
					}
				}
				
				margin = (2 * padding) * 0.3;
				
				if (me.objtype == "PANEL" || me.objtype == "TAB")
				{
					margin = 20;
					
					sx = bbox.x + padding;
					tx = bbox.x + padding + 20;
					sy = bbox.y + padding + 20;
					ty = bbox.y + bbox.h - padding * 2 - 20;
					
					if (sy < px.y && px.y < ty)
					{
						if (sx < px.x && px.x < tx)
						{
							r = "left";
						}
						else if (bbox.x + bbox.w - padding * 2 - 20 < px.x && px.x < bbox.x + bbox.w - padding * 2)
						{
							r = "right";
						}
					}
					else if (sx < px.x && px.x < bbox.x + bbox.w - padding * 2)
					{
						if (bbox.y + padding < px. y && px.y < sy)
						{
							r = "top";
						}
						else if (bbox.y + bbox.h - padding * 2 - 20 < px.y && px. y < bbox.y + bbox.h - padding * 2)
						{
							r = "bottom";
						}
					}
					
					if (me.objtype == "TAB" && r == "none")
					{
						me._pc.children = me._pc.children || [];
						
						if (me._pc.children.length > 0)
						{
							if (bbox.x < px.x && px.x < bbox.x + bbox.w &&
							    bbox.y + 20 < px.y && px.y < bbox.y + 40)
							{
								r = "inner";
							}
						}
						else
						{
							r = "inner";
						}
					}
					else if (me.objtype == "PANEL" && r == "none")
					{
						if (me._pc.children.length > 0 && me._pc.children[0].objtype == "_dc" && me._pc.children[0].children.length)
						{
							r = "_panel_";
						}
						else 
						{
							r = "inner";
						}
					}
				}
				else
				{
					margin = 0.3;
					
					mh = bbox.h - padding * 2;
					mw = bbox.w - padding * 2;
					
					sx = bbox.x + padding;
					sy = bbox.y + padding + mh * margin;
					
					tx = bbox.x + padding + mw * margin;
					ty = bbox.y + bbox.h - mh * margin - padding;
					
					if (sy < px.y && px.y < ty)
					{
						if (sx < px.x && px.x < tx)
						{
							r = "left";
						}
						else if (bbox.x + bbox.w - mw * margin - padding < px.x && px.x < bbox.x + bbox.w - padding)
						{
							r = "right";
						}
					}
					else if (tx < px.x && px.x < bbox.x + bbox.w - mw * margin - padding)
					{
						if (bbox.y + padding < px.y && px. y < bbox.y + padding + mh * margin)
						{
							r = "top";
						}
						else if (bbox.y + bbox.h - mh * margin - padding < px. y && px.y < bbox.y + bbox.h - padding)
						{
							r = "bottom";
						}
					}
				}
			}
		}
		return r;
	},
	
	l1/*init*/: function() {
		var me = this;

		me.b/*setButtons*/();
	},
	
	l2/*resizeH*/: function() {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.binner),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.binner),
			bh = (me._v == true) ? IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.b2/*boxtitle*/) + 3: 0,
			b3/*boxcontent*/ = me.b3/*boxcontent*/,
			r2, r2w, r2h;
		
		if (w > 0 && h - bh > 0)
		{
			b3/*boxcontent*/.height(h-bh);
			
			if (me.view)
			{
				r2 = me.view.renderTo;
				if (r2)
				{
					r2 = $(r2);
					r2w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(r2);
					r2h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(r2);
					if (r2w != w && r2h != h-bh)
					{
						IG$/*mainapp*/.x_10/*jqueryExtension*/._w(r2, w);
						IG$/*mainapp*/.x_10/*jqueryExtension*/._h(r2, h-bh);
					}
				}
				
				if (me.objtype != "_dc")
				{
					me.view.setSize(w, h-bh, true);
					b3/*boxcontent*/.hide().show(0);
				}
			}
		}
	},
	
	setTitle: function(text) {
		var me = this,
			t;
		
		me.title = text;
		
		me.applyFlt();
	},
	
	_title: function(t) {
		var me = this,
			tdiv = $("#dock_title_text", me.b2/*boxtitle*/);
		
		tdiv.html(t || "&nbsp;");
		
		me.b1/*box*/.trigger("titlechange", {
			panel: me
		});
	},
	
	formatTitle: function(text) {
		var me = this,
			param = me._param,
			n, m,
			pname;
		
		text = IG$/*mainapp*/._rrcs(me, text);
		
		n = text ? text.lastIndexOf("${") : -1;
		
		while (n > -1)
		{
			m = text.indexOf("}", n);
			
			if (m > -1)
			{
				pname = text.substring(n+2, m);
				
				text = text.substring(0, n) + (pname && param && param[pname] ? param[pname] : "") + text.substring(m+1);
			}
			else
			{
				break;
			}
			n = text.lastIndexOf("${", n+2);
		}
		
		return text;
	},
	
	applyFlt: function() {
		var me = this,
			text = me.title,
			t;
		
		t = me.formatTitle(text);
		
		me.title_disp = t;
		
		me._title(t);
	},
	
	showTitle: function(visible, force) {
		if (typeof(visible) != "undefined")
		{
			var me = this;
			if (force != true)
			{
				me.showtitle = visible;
			}
			
			if (visible != me._v)
			{
				me._v = (me.owner.editmode ? true : visible);
				me.b2/*boxtitle*/[me._v == false ? "hide" : "show"]();
				me.l2/*resizeH*/();
			}
		}
	},
	
	hide: function() {
		this.b1/*box*/.hide();
	},
	
	show: function() {
		if (this.objtype != "_dc")
			this.b1/*box*/.show();
	},
		
	viewchange: function(enable, isrstat) {
		var me = this;
		me.btnmap["viewgrid"] && me.btnmap["viewgrid"].el[enable ? "show" : "hide"]();
		me.btnmap["viewchart"] && me.btnmap["viewchart"].el[enable ? "show" : "hide"]();
		me.btnmap["viewrstat"] && me.btnmap["viewrstat"].el[enable && isrstat ? "show" : "hide"]();
	},

	setReportOption: function(sop) {
		var me = this,
			sval,
			sheet_toolbar = ig$/*appoption*/.sheet_toolbar,
			st,
			stbtn,
			bmode = {},
			i,
			mvval,
			msval, n,
			bmap = [];

		me.btnmap["exp_excel"].el.hide();
		me.btnmap["exp_pdf"].el.hide();
		me.btnmap["exp_csv"].el.hide();
		me.btnmap["jasper_excel"].el.hide();
		me.btnmap["jasper_pdf"].el.hide();
		me.btnmap["jasper_docx"].el.hide();
		me.btnmap["jasper_html"].el.hide();
		me.btnmap["jasper_ppt"].el.hide();
		me.btnmap["jasper_rtf"].el.hide();
		me.btnmap["office_0"].el.hide();
		me.btnmap["office_1"].el.hide();
		me.btnmap["office_2"].el.hide();
		me.btnmap["office_3"].el.hide();
		
		if (sop && sop.tb_prt_i)
		{
			mvval = sop.tb_prt_i.split(";");
			msval = sop.tb_prt_s ? sop.tb_prt_s.split(";") : []; 
			
			for (i=0; i < mvval.length; i++)
			{
				bmode[mvval[i]] = {
					icon: msval[i]
				};
			}
		}
		
		if (sheet_toolbar)
		{
			for (i=0; i < sheet_toolbar.length; i++)
			{
				st = sheet_toolbar[i];
				stbtn = me.btnmap[st.key];
				stbtn && stbtn.el.hide();
				
				bmode[st.key] && me.btnmap[st.key].el.show(); 
			}
		}
		
		if (sop)
		{
			me.viewchange(sop.tb_vch);

			if (sop.tb_prt && sop.tb_prt_i)
			{
				bmap = [
				    {n: "excel", m: "exp_excel"},
				    {n: "pdf", m: "exp_pdf"},
				    {n: "csv", m: "exp_csv"},
				    {n: "jasper_excel", m: "jasper_excel"},
				    {n: "jasper_pdf", m: "jasper_pdf"},
				    {n: "jasper_ppt", m: "jasper_ppt"},
				    {n: "jasper_docx", m: "jasper_docx"},
				    {n: "jasper_rtf", m: "jasper_rtf"},
				    {n: "jasper_html", m: "jasper_html"},
				    {n: "office_0", m: "office_0"},
				    {n: "office_1", m: "office_1"},
				    {n: "office_2", m: "office_2"},
				    {n: "office_3", m: "office_3"}
				];
				
				$.each(bmap, function(i, k) {
					if (bmode[k.n])
					{
						me.btnmap[k.m].el.show();
						
						if (bmode[k.n].icon)
						{
							me.btnmap[k.m].el.addClass(bmode[k.n].icon);
						}
					}
				});
			}
		}
	},
	
	l3/*showDropProxy*/: function() {
		var me = this;
		
		me.owner.sdpx/*showdropproxy*/.call(me.owner, me);
		me.l5/*_sizeDropProxy*/();
	},
	
	l4/*hideDropProxy*/: function() {
		var me = this;
		me.owner.sdph/*hidedropproxy*/.call(me.owner, me);
	},
	
	l5/*_sizeDropProxy*/: function() {
		var me = this,
			b0/*basecontainer*/ = $(me.owner.b0/*basecontainer*/),
			os = me.b1/*box*/.offset(),
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.b1/*box*/),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.b1/*box*/),
			b4/*dropproxy*/ = me.b4/*dropproxy*/;
			
		me.bbox = {
			x: os.left + b0/*basecontainer*/.scrollLeft(),
			y: os.top + b0/*basecontainer*/.scrollTop(),
			w: w,
			h: h
		};
		
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(b4/*dropproxy*/, w);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(b4/*dropproxy*/, h);
	},
	
	_IIc/*setActive*/: function(active) {
		var me = this,
			titlebox = me.b2/*boxtitle*/,
			cbox = me.b3/*boxcontent*/;
		
		if (active == true)
		{
			titlebox.removeClass("doc_title_normal")
					.addClass("doc_title_selected");
					
			cbox.removeClass("doc_normal")
				.addClass("doc_active");
		}
		else
		{
			titlebox.removeClass("doc_title_selected")
				    .addClass("doc_title_normal");
				    
			cbox.removeClass("doc_active")
				.addClass("doc_normal");
		}
	},
	
	mL/*measureContainer*/: function() {
		var me = this,
			_pc = me._pc,
			mr;
		
		mr = {
			fixed: {
				w: _pc._fw,
				h: _pc._fh
			},
			flex: {
				w: _pc._w,
				h: _pc._h
			},
			m: {
				w: _pc._mw,
				h: _pc._mh
			}
		};
		
		return mr;
	}
};

// container code
IG$/*mainapp*/.dz/*dropZone*/ = function(container, cobj) {
	var me = this,
		pwidth = -1,
		pheight = -1,
		lmask,
		lbody,
		bbox;

	me.items = [];
	me.b5/*splitters*/ = [];
	me.editmode = false;
	
	me.cobj = cobj;
	// me.gap = 4;
	
	me.docid = 0;
	me.i1/*invalidate*/ = -1;
	me.i2/*sizeapplied*/ = 0;
	
	me.c0/*container*/ = container;
	me._el = {
		dom: container
	};
	
	me.b0/*basecontainer*/ = $("<div class='idv-doc-base'></div>").appendTo(container)
		.css({
			width: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(container),
			height: IG$/*mainapp*/.x_10/*jqueryExtension*/._h(container)
		});
	me.b1/*box*/ = $("<div class='idv-doc-layouter'></div>").appendTo(me.b0/*basecontainer*/)
		.css({
			minWidth: IG$/*mainapp*/.x_10/*jqueryExtension*/._w(container),
			minHeight: IG$/*mainapp*/.x_10/*jqueryExtension*/._h(container),
			position: "relative"
		});
		
	container.bind("resize", function() {
		var cheight = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(container),
			cwidth = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(container);
		
		if (cwidth > 0 && cheight > 0 && (pwidth != cwidth || pheight != cheight))
		{
			me.i2/*sizeapplied*/ = 1;
			me.b0/*basecontainer*/.css({
				width: cwidth,
				height: cheight
			});
			me.b1/*box*/.css({
				minWidth: cwidth,
				minHeight: cheight
			});
			me.cW/*containerWidth*/ = cwidth;
			me.cH/*containerHeight*/ = cheight;
			me._IM5/*updateDisplay*/.call(me, true);
		}
		
		pwidth = cwidth;
		pheight = cheight;
	});

	container.css({overflow: "hidden"});
	
	me.l1/*init*/();
	me.draggable = null;
}

IG$/*mainapp*/.dz/*dropZone*/.prototype = {
	l1/*init*/: function() {
		var me = this,
			b4/*dropproxy*/;
		
		b4/*dropproxy*/= me.b4/*dropproxy*/ = $("<div class='dock-inside-wrap'></div>")
			.css({position: "absolute", top: 0, left: 0})
			.appendTo(me.b0/*basecontainer*/)
			.dselect();
		
		b4/*dropproxy*/.hide();
		
		me.dockinsg = $("<div class='dock-inside-guide'></div>")
			.css({position: "absolute"})
			.appendTo(me.b0/*basecontainer*/)
			.hide()
			.dselect();
		
		me.bodylist = {};
		
		me._root = {
			type: "mondrian",
			draggable: false,
			objtype: "_dc",
			_direction: 0, // 0 horizontal, 1 vertical
			width: null,
			height: null,
			children: []
		};
		
		// me._cD/*configDropZone*/();
	},
	
	_cD/*configDropZone*/: function() {
		var owner = this,
			el = owner.b0/*basecontainer*/[0];
		
        if ($s.create && $s.dropzone)
        {
            owner.dropZone = $s.create($s.dropzone, el, {
                ddGroup: '_I$RD_G_',
                
                nodeouttimer: -1,
                
                notifyOut : function(dd, e, data){
                    var me = this;
                    if(me.lastOverNode){
                        me.onNodeOut(me.lastOverNode, dd, e, data);
                        me.lastOverNode = null;
                    }
                    
                    grid.isDragging = false;
                    if (!grid.hideDropFeedback)
                        return;
                    
                    grid.hideDropFeedback.call(grid, e);
                    
                    if (me.accept == true && me.pivotmove == true)
                    {
                        if (grid.sheetobj)
                        {
                            if (me.nodeouttimer > -1)
                            {
                                clearTimeout(me.nodeouttimer);
                            }
                            
                            me.nodeouttimer = setTimeout(function() {
                                grid.hideDropFeedback.call(grid, e);
                            }, 100);
                            // grid.sheetobj._IP4/*procUpdateReport*/.call(grid.sheetobj);
                        }
                    }
                },
                
                onNodeEnter : function(target, dd, e, data){
                    var me = this,
                        i,
                        dt, dttype,
                        hasitem = false,
                        accept = false,
                        ui;
                        
                    if (data.records && data.records.length > 0)
                    {
                        dt = data.records[0].get("type");
                        
                        if (dt == "Report")
                        {
                            accept = true;
                        }
                    }
                    else if (data.cellData)
                    {
                        dt = data.cellData;
                        accept = true;
                    }
                    
                    if (accept)
                    {
                        owner.l3/*showDropProxy*/.call(owner, e, ui);
                    }
                                    
                    me.accept = accept;
                },
                onNodeOut : function(target, dd, e, data){
                    
                },
                onNodeOver : function(target, dd, e, data){
                    var me = this,
                        dt,
                        ret,
                        ui;
                        
                    if (window.Ext)
                    {
                        ret = ((me.accept == true) ? Ext.dd.DropZone.prototype.dropAllowed : Ext.dd.DropZone.prototype.dropNotAllowed);
                    }
                    else
                    {
                        ret = me.accept;
                    }
                    if (me.accept == true)
                    {
                        if (data.records && data.records.length > 0)
                        {
                            dt = data.records[0].data;
                        }
                        else
                        {
                            dt = data.cellData;
                        }
                        
                        owner.l17/*dragOver*/.call(owner, e.browserEvent, ui);
                    }
                    return ret;
                },
                onNodeDrop : function(target, dd, e, data){
                    var me = this;
                    if (me.accept == true)
                    {
                        if (data.records && data.records.length > 0)
                        {
                            dt = data.records[0].data;
                            grid.sobj.d3/*onDropTable*/.call(grid.sobj, e, dt);
                        }
                        else
                        {
                            dt = data.cellData;
                        }
                    }
                    
                    me.accept = false;
                    return true;
                }
            });
        }
	},
	
	_IIf/*customLoad*/: function(visible, mview) {
		if (visible == true)
		{
			var me = this,
				btn,
				dom,
				lm,
				ld,
				i;
			
			// me.renderDiv.css({position: "absolute"});
			// me.renderDiv.width(me.getWidth()).height(me.getHeight());
			
			me._ldo = me._ldo || [];
			if (mview)
			{
				for (i=0; i < me._ldo.length; i++)
				{
					if (me._ldo[i] == mview)
					{
						return;	
					}
				}
			}
			
			me._ldo.push(mview);
			
			lm = {
				msg: IRm$/*resources*/.r1("B_PROC") + " <button id='m-mec-loader'>" + IRm$/*resources*/.r1("B_PROC_CANCEL") + "</button>"
			};
			
			ld = me.setLoading(lm);
			
			dom = $(me.rendermask);
			
			btn = $("#m-mec-loader", dom).bind("click", function() {
				$.each(me._ldo, function(i, lview) {
					lview && lview._IP5/*cancelQuery*/ && lview._IP5/*cancelQuery*/.call(lview);
				});
				
				me.setLoading(false);
			});
		}
	},
	
	_slx/*setLoading*/: function(view) {
		var me = this,
			i,
			bf = 0;
			
		if (me._ldo)
		{
			for (i=me._ldo.length-1; i>=0; i--)
			{
				if (me._ldo[i] == view)
				{
					me._ldo.splice(i, 1);
					bf = 1;
				}
			}
			
			if (me._ldo.length == 0)
			{
				me.setLoading(false);
			}
		}
	},
	
	setLoading: function(load, targetEl) {
		var me = this,
            config = {
                target: me
            };

        if (me._el.dom) {
            me.loadMask && me.loadMask.destroy();
            config.target.rendermask = null;
            me.loadMask = null;

            if (load !== false) {
                if (IG$/*mainapp*/.isObject(load)) 
                {
                    IG$/*mainapp*/.apply(config, load);
                } 
                else if (IG$/*mainapp*/.isString(load)) 
                {
                    config.msg = load;
                }
                
                me.loadMask = new IG$/*mainapp*/._pbm/*mask*/(config);
                me.loadMask.show();
            }
        }
        return me.loadMask;
	},
	
	mK/*processLayoutItem*/: function(_pcontainer, isroot, report, ctrls) {
		var me = this,
			ubody,
			sheet,
			ctrls = me.ctrls,
			iscontainer,
			i, obj;
			
		sheet = ctrls[_pcontainer.docid] || new IG$/*mainapp*/._IFc/*sheetfiltercomp*/(null);
		ubody = me._IMc/*appendBox*/.call(me, _pcontainer.docid,  
			{
				width: (_pcontainer.width ? parseInt(_pcontainer.width) : null), 
				height: (_pcontainer.height ? parseInt(_pcontainer.height) : null),
				title: sheet.name || "",
				close: sheet.close,
				hidetitle: sheet.hidetitle,
				fw/*fixedwidth*/: sheet.fw/*fixedwidth*/,
				fh/*fixedheight*/: sheet.fh/*fixedheight*/,
				showtab: (sheet.sf/*taboption*/ && sheet.sf/*taboption*/.showtab == "F") ? false : true,
				draggable: me.draggable
			}, _pcontainer.objtype);
		
		_pcontainer.docid = ubody.docid;
		ubody.objtype = _pcontainer.objtype;
		
    	sheet.objtype = ubody.objtype;
    	sheet.docid = ubody.docid;
    	
    	ctrls[ubody.docid] = sheet;
    	
    	_pcontainer.lt = {
			pos: {
				x: 0,
				y: 0,
				w: 0,
				h: 0
			},
			ubody: ubody
		};
		
		ubody._pc = _pcontainer;
    	
    	ubody.m1/*validateProperty*/.call(ubody);
    	
    	$.each(_pcontainer.children, function(i, d) {
    		me.mK/*processLayoutItem*/.call(me, d, false, report, ctrls);
    	});
	},
	
	mKa/*processLayoutView*/: function(report) {
		var me = this,
			ctrls = me.ctrls,
			hasfilter = [];
		
		me._async = {
			c: 0,
			f: 0,
			bd: []
		};
		
		$.each(me.items, function(i, ubody) {
			ubody.__$m/*loaded*/ = 0;
			me._async.bd.push(ubody);
			
			switch (ubody.objtype)
			{
			case "FILTER":
				me._async.f ++;
				hasfilter.push(ubody);
				break;
			default:
				me._async.c ++;
				break;
			}
		});
		
		$.each(me.items, function(i, ubody) {
			var view,
				sheet = ctrls[ubody.docid];
			
			ubody.b3/*boxcontent*/.bind("i_ready", function(e) {
				var m,
					f, afilter;
					
				e.stopPropagation();
				
				if (ubody.__$m/*loaded*/)
					return;
					
				ubody.__$m/*loaded*/ = 1;
				
    			switch (ubody.objtype)
    			{
    			case "FILTER":
    				me._async.f --;
    				break;
    			default:
    				me._async.c --;
    				break;
    			}
    			
    			if (me._async.c == 0 && me._async.f == 0 && me.cmode == 0)
    			{
    				if (hasfilter.length)
    				{
    					if (hasfilter.length == 1)
    					{
    						f = hasfilter[0];
    						f.view && f.view.l5/*updateFilterValues*/.call(f.view, true, true);
    					}
    					else
    					{
    						$.each(hasfilter, function(m, mf) {
    							var v = mf.view,
    								filteroptions,
    								showbutton,
    								f_b_trg,
    								f_b_trg_all;
    								
	    						if (v)
	    						{
	    							filteroptions = v._ILb/*sheetoption*/.pff1a/*filteroptions*/;
									showbutton = filteroptions ? filteroptions.showbutton : false;
									f_b_trg = (showbutton && filteroptions.f_b_trg == "T") ? 1 : 0;
									f_b_trg_all = f_b_trg && filteroptions.f_b_trg_all == "T" ? 1 : 0;
									
									if (f_b_trg)
									{
										f = mf;
									}
	    						}
	    					});
	    					
    						if (!f)
    						{
    							f = hasfilter[hasfilter.length-1];
    						}
    						
    						f.view && f.view.l5/*updateFilterValues*/.call(f.view, true, true);
	    				}
    				}
    				else
    				{
    					me.cobj._t$/*toolbarHandler*/.call(me.cobj, "cmd_run", null, null, null, 1);
    				}
    			}
    		});
			
			me.CV/*createView*/.call(me, ubody, report);
		});
		
		// after render
		$.each(me.items, function(i, ubody) {
			if (ubody.objtype == "FILTER")
			{
				ubody.view._IFd/*init_f*/.call(ubody.view, true);
			}
		});
	},
	
	CV/*createView*/: function(ubody, report) {
		var me = this,
			ctrls = me.ctrls,
			view,
			sheet = ctrls[ubody.docid];
		
		if (ubody.objtype == "FILTER")
    	{
    		if (report.__dreg && report.__dreg[sheet.docid])
    		{
    			view = report.__dreg[sheet.docid].fobj;
    			view.report = report;
    			view._ILb/*sheetoption*/ = sheet;
    			view.dzone = me;
    			view._IFd/*init_f*/.call(view);
    			ubody.hidden = true;
    		}
    		else
    		{
    			view = new IG$/*mainapp*/._Ied/*dynFilterView*/(ubody.b3/*boxcontent*/, sheet, report);
    		}
    		view.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(report, report._IO1/*onFilterUpdate*/);
    	}
    	else if (ubody.objtype == "TEXT")
    	{
    		view = new IG$/*mainapp*/._IA2/*rfText*/(ubody.b3/*boxcontent*/, sheet);
    		ubody.b3/*boxcontent*/.trigger("i_ready");
    	}
    	else if (ubody.objtype == "NAVI")
    	{
    		view = new IG$/*mainapp*/._IA3/*rfNavi*/(ubody.b3/*boxcontent*/, sheet);
    		ubody.b3/*boxcontent*/.trigger("i_ready");
    	}
    	else if (ubody.objtype == "PANEL" || ubody.objtype == "")
    	{
    		view = new IG$/*mainapp*/._IA4/*rfBlankPanel*/(ubody.b3/*boxcontent*/, sheet);
    		ubody.b3/*boxcontent*/.trigger("i_ready");
    	}
    	else if (ubody.objtype == "TAB")
    	{
    		view = new IG$/*mainapp*/._IA5/*rfTabPanel*/(ubody.b3/*boxcontent*/, sheet, me, report);
    		ubody.b3/*boxcontent*/.trigger("i_ready");
    	}
    	else if (ubody.objtype == "RPT_VIEW")
    	{
    		view = new IG$/*mainapp*/._IA5r/*rfReportViewer*/(ubody.b3/*boxcontent*/, sheet, me, report);
    		view.l3/*validateItems*/.call(view, undefined, true);
    	}
    	else if (ubody.objtype == "SHEET")
    	{
    		view = null;
    	}
    	else
    	{
    		view = null;
    		ubody.b3/*boxcontent*/.trigger("i_ready");
    	}
    	
    	if (ubody.objtype)
    	{
    		ubody.b1/*box*/.addClass("igc-" + ubody.objtype.toLowerCase() + "-cnt");
    	}
    	
    	if (view)
    	{
    		view._ILb/*sheetoption*/ = sheet;
    		ubody.view = view;
    		
    		if (ubody.objtype == "FILTER")
    		{
    			ubody.setReportOption.call(ubody, sheet);
    			ubody.b3/*boxcontent*/.bind("export_sheet", function(e, view, opt) {
    				var panel = me.cobj;
    				panel._IB3/*exportToFile*/.call(panel, opt.filetype.toUpperCase(), false, view);
    			});
    		}
    	}
	},
	
	ic/*iscontainer*/: function(objtype) {
		return objtype == "TAB" || objtype == "PANEL" || objtype == "_dc";
	},
	
	tLayout: function(layout) {
		var me = this,
			i,
			r = {
				type: "mondrian",
				objtype: "_dc",
				children: [],
				_direction: 0,
				width: null,
				height: null
			};
			
		if (layout.layout && layout.layout.item)
		{
			me.E/*tLayoutP*/(layout.layout.item, r, -1);
		}
		
		return r;
	},
	
	E/*tLayoutP*/: function(item, pnode, seq) {
		var me = this,
			inode = {
				objtype: item.objtype,
				docid: item.docid,
				iscontainer: me.ic/*iscontainer*/(item.objtype),
				parent: pnode,
				width: parseInt(item.width),
				height: parseInt(item.height),
				children: []
			};
		
		if (seq > -1)
		{
			pnode.children.splice(seq, 0, inode);
		}
		else
		{
			pnode.children.push(inode);
		}
		
		$.each(["top", "bottom", "right", "left", "inner"], function(i, k) {
			var cnodes = item[k],
				cnode, knode,
				i, j,
				mdirection,
				before = 0,
				nseq = -1;
			
			if (cnodes && cnodes.length)
			{
				if (inode.objtype == "PANEL" && k == "inner")
				{
					knode = {
						objtype: "_dc",
						docid: null,
						iscontainer: true,
						parent: inode,
						_direction: 0,
						width: inode.width,
						height: inode.height,
						children: []
					};
					
					inode.children.push(knode);
					nseq = -1;
					
					for (i=0; i < cnodes.length; i++)
					{
						cnode = cnodes[i];
						cnode.parent = knode;
						me.E/*tLayoutP*/(cnode, cnode.parent, nseq);
					}
				}
				else if (inode.objtype == "TAB" && k == "inner")
				{
					for (i=0; i < cnodes.length; i++)
					{
						cnode = cnodes[i];
						cnode.parent = inode;
						me.E/*tLayoutP*/(cnode, cnode.parent, -1);
					}
				}
				else if (inode.parent.objtype == "_dc")
				{
					for (i=0; i < cnodes.length; i++)
					{
						cnode = cnodes[i];
						
						if (k == "top" || k == "bottom")
						{
							mdirection = 1;
						}
						else if (k == "left" || k == "right")
						{
							mdirection = 0;
						}
						
						if (k == "left" || k == "top")
						{
							before = 1;
						}
						
						if (inode.parent._direction == mdirection || inode.parent.children.length < 2) // vertical
						{
							inode.parent._direction = mdirection;
							cnode.parent = inode.parent;
							
							for (j=0; j < cnode.parent.children.length; j++)
							{
								if (cnode.parent.children[j] == inode)
								{
									nseq = before ? j : j+1;
									break;
								}
							}
						}
						else
						{
							knode = {
								objtype: "_dc",
								docid: null,
								iscontainer: true,
								parent: inode.parent,
								_direction: mdirection,
								width: null,
								height: null,
								children: []
							};
							
							for (j=0; j < inode.parent.children.length; j++)
							{
								if (inode.parent.children[j] == inode)
								{
									inode.parent.children.splice(j, 1, knode);
									break;
								}
							}
							
							inode.parent = knode;
							knode.children.push(inode);
							cnode.parent = knode;
							
							if (before)
							{
								nseq = 0;
							}
						}
						me.E/*tLayoutP*/(cnode, cnode.parent, nseq);
					}
				}
				else
				{
					
				}
			}
		});
		
		me.D/*tNodeSize*/(pnode);
	},
	
	D/*tNodeSize*/: function(node) {
		var i,
			w = 0,
			h = 0,
			c;
		
		for (i=0; i < node.children.length; i++)
		{
			c = node.children[i];
			if (c.width && c.height)
			{
				if (node._direction == 0)
				{
					w += c.width;
					h = Math.max(h, c.height);
				}
				else
				{
					w = Math.max(w, c.width);
					h += c.height;
				}
			}
		}
		
		node.width = w;
		node.height = h;
	},
	
	m1/*makeLayout*/: function(report, root, ctrls) {
		var me = this,
			i,
			layoutitem,
			ubody,
			rootnode;
		
		me._root = root;
		me.ctrls = ctrls;
		
		if (root)
		{
			me.gdoc_id(root);
			me.mK/*processLayoutItem*/(root, true, report, ctrls);
			me._IM5/*updateDisplay*/(false, true);
			me.mKa/*processLayoutView*/(report);
		}
	},
	
	gdoc_id: function(p) {
		var me = this;
		
		me.doc_id(p.docid);
		
		if (p.children)
		{
			$.each(p.children, function(i, k) {
				me.gdoc_id(k);
			});
		}
	},
	
	doc_id: function(docid) {
		var me = this,
			id;
		
		if (docid && docid.indexOf("_") > -1)
		{
			id = parseInt(docid.substring(docid.indexOf("_")+1)) + 1;
			me.docid = Math.max(me.docid, id);
		}
	},
	
	sd/*showdrop*/: function(docitem, pos, loc) {
		var me = this,
			ditem = me.docitems[docitem.docid],
			binner = docitem.binner,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(binner),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(binner),
			b4/*dropproxy*/ = me.b4/*dropproxy*/,
			i, dw, dh;
		
		me.sdpx/*showdropproxy*/(docitem);
		
		IG$/*mainapp*/.x_10/*jqueryExtension*/._w(b4/*dropproxy*/, w);
		IG$/*mainapp*/.x_10/*jqueryExtension*/._h(b4/*dropproxy*/, h);
		
		pos.top += me.__mpos ? me.__mpos.top : 0;
		pos.left += me.__mpos ? me.__mpos.left : 0;
		
		me.dockinsg.css(pos);
		me.dockinsg.show();
	},
	
	sdpx/*showdropproxy*/: function(docitem) {
		var me = this,
			b4/*dropproxy*/ = me.b4/*dropproxy*/,
			dockinsg = me.dockinsg,
			os = docitem.binner.offset(),
			b0/*basecontainer*/ = $(me.b0/*basecontainer*/),
			mos = b0/*basecontainer*/.offset();
		
		me.__mpos = {
			top: os.top - mos.top + b0/*basecontainer*/.scrollTop(),
			left: os.left - mos.left + b0/*basecontainer*/.scrollLeft()
		};
		
		b4/*dropproxy*/.css({
			top: me.__mpos.top,
			left: me.__mpos.left,
			zIndex: 120
		});
		b4/*dropproxy*/.show();
		
		dockinsg.css({
			zIndex: 122
		});
		
		dockinsg.show();
	},
	
	sdph/*hidedropproxy*/: function(docitem) {
		var me = this,
			b4/*dropproxy*/ = me.b4/*dropproxy*/,
			dockinsg = me.dockinsg;
			
		b4/*dropproxy*/.hide();
		dockinsg.hide();
	},
	
	_t1/*titlechange_handler*/: function() {
		var me = this;
		$.each(me.items, function(i, ubody) {
			if (ubody.objtype == "TAB")
			{
				ubody.view.l3/*validateItems*/.call(ubody.view);
			}
		});
	},
	
	_IMc/*appendBox*/: function(docid, config, objtype) {
		var me = this,
			b, id,
			isnew,
			litem;
			
		if (!docid)
		{
			docid = "dock_" + (me.docid++);
			isnew = true;
		}
		else if (docid.indexOf("_") > -1)
		{
			id = parseInt(docid.substring(docid.indexOf("_")+1)) + 1;
			me.docid = Math.max(me.docid, id);
		}
		
		if (me.bodylist[docid])
		{
			b = me.bodylist[docid];
		}
		else
		{
			if (config)
			{
				config.objtype = config.objtype || objtype;
			}
			b = new IG$/*mainapp*/.di/*dropItem*/(me, docid, config);
			b.b1/*box*/.appendTo(me.b1/*box*/);
			me.items.push(b);
			
			me.bodylist[docid] = b;
		}
		
		b.b1/*box*/.bind("titlechange", function() {
			me._t1/*titlechange_handler*/.call(me);
		});
		
		if (!isnew)
		{
			me._IM5/*updateDisplay*/.call(me);
		}

		return b;
	},
	
	_IIb/*getBox*/: function(docid) {
		var me = this,
			i, item,
			items = me.items,
			r = null;
		
		for (i=0; i < items.length; i++)
		{
			if (items[i].docid == docid)
			{
				r = items[i];
				break;
			}
		}
		
		return r;
	},
	
	_IN9/*clearAll*/: function() {
		var i,
			me = this,
			items = me.items;
		
		for (i=items.length-1; i >= 0; i--)
		{
			items[i].b1/*box*/.remove();
			items.splice(i, 1);
		}
		
		me.bodylist = {};
		me.docitems = {};
		
		me._IM5/*updateDisplay*/();
	},
	
	l8/*removeBox*/: function(docid, skip_event, skip_parent) {
		var me = this,
			i,
			items = me.items, item,
			pnode,
			arr;
			
		for (i=0; i < items.length; i++)
		{
			if (items[i].docid == docid)
			{
				items[i].b1/*box*/.remove();
				items.splice(i, 1);
				break;
			}
		}
		
		item = me.docitems[docid];
		
		if (item && item.children && item.children.length)
		{
			for (i=item.children.length-1; i>=0; i--)
			{
				me.l8/*removeBox*/(item.children[i].docid, 1, 1);
			}
		}
		
		if (!skip_parent && item && item.parent)
		{
			pnode = item.parent.node;
			arr = item.parent.children;
			for (i=0; i < arr.length; i++)
			{
				if (arr[i].docid == item.docid)
				{
					arr.splice(i, 1);
					break;
				}
			}
			
			if (item.parent.objtype == "_dc" && item.parent.children.length == 0)
			{
				me.l8/*removeBox*/(item.parent.docid, skip_event);
			}
		}
		
		delete me.bodylist[docid];
		delete me.docitems[docid];
		
		if (!skip_event)
		{
			me._IM5/*updateDisplay*/.call(me);
		}
	},
	
	l8a/*closeDock*/: function(docid) {
		var me = this,
			docitems = me.docitems,
			item;
		
		item = docitems[docid];
		
		if (item.container == true && !item.parent)
		{
			return;
		}
		
		IG$/*mainapp*/._I55/*confirmMessages*/(ig$/*appoption*/.appname, "Confirm to delete content?", function(e) {
			if (e == "yes")
			{
				var r = true,
					newparent, i, relative;
				
				if (me._IM6/*closeDockNotify*/)
				{
					r = me._IM6/*closeDockNotify*/.f.call(me._IM6/*closeDockNotify*/.s, docid);
				}
				
				if (r == true)
				{
					me.l8/*removeBox*/.call(me, docid);
				}
			}
		});
	},
	
	l8M/*maximizeDock*/: function(docid) {
		var me = this,
			r = true,
			bodylist = me.bodylist,
			item, relative;
		
		if (me.maximizeDockNotify)
		{
			r = me.maximizeDockNotify.f.call(me.closeDockNotify.s, docid);
		}
		
		if (r == true)
		{
			item = bodylist[docid];
			item.status = (item.status == "max") ? null : "max";
			item.btnmap["maximize"].el[item.status == "max" ? "addClass" : "removeClass"]("dock_minimize");
			me._IM5/*updateDisplay*/.call(me);
		}
	},
	
	l8c/*configDock*/: function(docid, cmode) {
		var me = this;
		
		switch (cmode)
		{
		case 2:
			me.b1/*box*/.trigger("config_pivot", docid);
			break;
		case 1:
			me.b1/*box*/.trigger("cmenu_1", docid);
			break;
		default:
			me.b1/*box*/.trigger("config_doc", docid);
			// me._IM7/*configDockNotify*/ && me._IM7/*configDockNotify*/.f.call(me._IM7/*configDockNotify*/.s, docid);
			break;
		}
	},
	
	l9/*setLayout*/: function(layout) {
		this.l10/*processLayout*/(layout, null);
	},
	
	l10/*processLayout*/: function(items, udoc) {
		if (items && items.length > 0)
		{
			var i,
				panel,
				item;
			for (i=0; i < items.length; i++)
			{
				item = items[i];
				item.draggable = this.draggable;
				panel = this._IMc/*appendBox*/(item.docid || null, item, item.objtype);
				panel.objtype = item.objtype;
				if (item.items)
				{
					this.l10/*processLayout*/(item.items, panel);
				}
			}
		}
	},
	
	l10a/*getLayout*/: function() {
		var me = this,
			root = me._root,
			r = "",
			layout = [],
			dobj;
		
		me._g1/*layout*/(root, layout, null);
		
		r = layout.join("|");
		
		return r;
	},
	
	_g1/*layout*/: function(item, layout, pitem) {
		var me = this,
			r = "";
		
		r += "docid=" + item.docid + 
			",objtype=" + (item.objtype || "") +
			",width=" + (item.width || "") +
			",height=" + (item.height || "");
			
		if (typeof(item._direction) == "undefined")
		{
			item._direction = 0;
		}
		
		r += ",r=" + (pitem ? pitem.docid : "") +
			",p=" + ("") + 
			",d=" + (item._direction);
			
		layout.push(r);
		
		if (item.children)
		{
			$.each(item.children, function(i, citem) {
				me._g1/*layout*/.call(me, citem, layout, item);
			});
		}
	},
	
	_IIc/*setActive*/: function(selitem) {
		var me = this,
			items = me.items,
			item,
			i;
		
		for (i=0; i < items.length; i++)
		{
			item = items[i];
			item._IIc/*setActive*/.call(item, (selitem == item));
		}
		
		me.b1/*box*/.trigger("activechanged", selitem);
	},
	
	l11/*clearSplitters*/: function() {
		var me = this,
			b5/*splitters*/ = me.b5/*splitters*/,
			splitter,
			i;
			
		for (i=b5/*splitters*/.length - 1; i>=0; i--) {
			splitter = b5/*splitters*/[i];
			splitter.l5/*remove*/();
			if (splitter.p2/*panel*/)
			{
				splitter.p2/*panel*/._SP = [];
			}
		}
		
		b5/*splitters*/ = [];
	},

	_IM5/*updateDisplay*/: function(b_resized, b_force) {
		var me = this;
		
		if (me.i1/*invalidate*/ > -1)
		{
			clearTimeout(me.i1/*invalidate*/);
		}

		if (b_force == true)
		{
			me.l13/*validateNow*/.call(me);
			if (!b_resized)
			{
				me.b1/*box*/.trigger("updatecomplete");
			}
			else
			{
				me.uX/*updateScale*/.call(me);
			}
		}
		else
		{
			me.i1/*invalidate*/ = setTimeout(function() {
				me.l13/*validateNow*/.call(me);
				if (!b_resized)
				{
					me.b1/*box*/.trigger("updatecomplete");
				}
				else
				{
					me.uX/*updateScale*/.call(me);
				}
			}, 50);
		}
	},
	
	l13/*validateNow*/: function() {
		var me = this,
			i,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.b0/*basecontainer*/)-2,
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.b0/*basecontainer*/)-2,
			item,
			haserror = false,
			hasmax = null,
			visible,
			node,
			dv,
			k,
			r,
			sheight = 20,
			mw, mh,
			ubody,
			rect,
			b1;
			
		me.l11/*clearSplitters*/();
			
		if (me._root && me._root.lt && w > 0 && h > 0)
		{
			item = me._root;
			ubody = item.lt.ubody;
			item.lt.pos.x = 0; item.lt.pos.y = 0; item.lt.pos.w = w; item.lt.pos.h = h;
			
			me.B/*updateNodeSize*/(me._root);
			
			me.docitems = {};
			r = ubody.mL/*measureContainer*/.call(ubody);
			
			mw = r.fixed.w;
			mh = r.fixed.h;
			
			w = Math.max(mw, w, r.m.w);
			h = Math.max(mh, h, r.m.h);
			
			if (mw > me.cW/*containerWidth*/ && mh < me.cH/*containerHeight*/)
			{
				h -= sheight;
			}
			else if (mh > me.cH/*containerHeight*/ && mw < me.cW/*containerWidth*/)
			{
				w -= sheight;
			}
			else if (mh > me.cH/*containerHeight*/ && mw > me.cW/*containerWidth*/)
			{
				w -= sheight;
				h -= sheight;
			}
			
			rect = {
				x: 0,
				y: 0,
				w: w,
				h: h
			};
			
			me.L1k/*updateLayout*/(item, 0, 0, w, h, 0, r, rect, false);
			
			for (k in me.bodylist)
			{
				if (me.bodylist[k].status == "max" && me.bodylist[k].visible != false)
				{
					hasmax = k;
					break;
				}
			}
			
			for (k in me.docitems)
			{
				node = me.docitems[k];
				visible = me.bodylist[k].visible;
				visible = (visible != false && me.bodylist[k].hidden == true) ? false : visible;
				
				b1 = node.lt.ubody.b1/*box*/;
				node.visible = ((!hasmax && visible != false) || k == hasmax);
				// node.lt.ubody.visible = node.visible;
				
				if (node.visible && node.objtype != "_dc")
				{
					b1.show();
					b1.trigger("resize");
				}
				else
				{
					b1.hide();
				}
			}
			
			if (!hasmax)
			{
				me.l14/*validateSplit*/();
			}
		}
	},
	
	uX/*updateScale*/: function() {
		var me = this,
			i,
			item,
			dv,
			css = {
				overflowX: "hidden",
				overflowY: "hidden"
			},
			oset,
			b1/*box*/ = me.b1/*box*/,
			boff = b1/*box*/.offset(),
			w, h, wmax = 0, hmax = 0, k,
			bpos;
		
		for (k in me.docitems)
		{
			item = me.docitems[k];
			if (item && item.lt && item.lt.ubody)
			{
				bpos = item.lt.pos;
				
				oset = {
					top: Math.round(bpos.y),
					left: Math.round(bpos.x)
				};
				
				w = Math.round(bpos.w);
				h = Math.round(bpos.h);
				
				wmax = Math.max(wmax, w + oset.left); // - boff.left);
				hmax = Math.max(hmax, h + oset.top); //  - boff.top);
				item.lt.ubody.width = w;
				item.lt.ubody.height = h;
				item.width = w;
				item.height = h;
			}
		}

		
		if (wmax > 0 && hmax > 0)
		{
			me.i2/*sizeapplied*/ = 1;
			
			IG$/*mainapp*/.x_10/*jqueryExtension*/._w(b1/*box*/, wmax);
			IG$/*mainapp*/.x_10/*jqueryExtension*/._h(b1/*box*/, hmax);
			
			if (wmax > me.cW/*containerWidth*/)
			{
				css.overflowX = "auto";
			}
			if (hmax > me.cH/*containerHeight*/)
			{
				css.overflowY = "auto";
			}
			me.b0/*basecontainer*/.css(css).animate({
				scrollTop: 0,
				scrollLeft: 0
			});
			
			me.b1/*box*/.trigger("boxresized");
		}
	},
	
	sT/*showTab*/: function(mview, visible) {
		var me = this;
		
		if (mview.view && mview.view.tab/*tabarea*/)
		{
			mview.view.editmode = me.editmode;
			mview.view.tab/*tabarea*/[visible ? "show" : "hide"]();
		}
	},
	
	L1k/*updateLayout*/: function(item, xx, yy, tw, th, seq, nbr, rect, _pitem) {
		var me = this,
			mbody = item.lt.ubody,
			sw, sh,
			pw, ph,
			sp = {
				top: false,
				left: false,
				right: false,
				bottom: false
			},
			fw, fh,
			m = {
				fixedw: 0,
				fixedh: 0,
				flexw: 0,
				flexh: 0
			},
			titleh = 0,
			istabview = (mbody.objtype == "TAB") ? true : false,
			ispanel = (mbody.objtype == "PANEL") ? true : false,
			bmax = mbody.status == "max",
			showtab = (istabview == true && mbody.view && mbody.view._ILb/*sheetoption*/ && 
				mbody.view._ILb/*sheetoption*/.sf/*taboption*/ && 
				mbody.view._ILb/*sheetoption*/.sf/*taboption*/.showtab == "F") ? false : true,
			tabheight = 0,
			ishidden = mbody.hidden,
			iscontainer = (istabview || ispanel),
			b1, bpos,
			mshow = me.editmode ? "show" : "hide",
			btnmap = mbody.btnmap,
			pos,
			r, tg,
			__pp, __gpp,
			_mp;
		
		btnmap["pivot"].el[me.editmode && (mbody.objtype == "SHEET" || mbody.objtype == "FILTER") ? "show" : "hide"]();
		btnmap["config"].el[mshow]();
		btnmap["close"].el[mshow]();
		
		__pp = item.parent;
		
		while (__pp && !ishidden)
		{
			if (__pp.hidden)
			{
				ishidden = 1;
				break
			}
			else if (__pp.visible == false)
			{
				ishidden = 1;
				break;
			}
			
			__gpp = __pp.parent;
			
			if (__gpp && __gpp.objtype == "TAB")
			{
				if (__gpp.active != __pp.docid)
				{
					ishidden = 1;
					break;
				}
			}
			
			__pp = __pp.parent;
		}
		
		if (me.bodylist[mbody.docid] && me.bodylist[mbody.docid].view)
		{
			me.bodylist[mbody.docid].view._editmode = me.editmode;
		}
		
		if (me.editmode)
		{
			mbody.showTitle.call(mbody, true, true);
			
			if (istabview)
			{
				me.sT/*shoeTab*/(mbody, true);
			}
			
			if (_pitem && _pitem.objtype == "TAB")
			{
				tabheight = 24;
			}
		}
		else
		{
			mbody.showTitle.call(mbody, mbody.showtitle, true);
			
			if (istabview && showtab)
			{
				me.sT/*shoeTab*/(mbody, true);
			}
			else if (istabview)
			{
				me.sT/*shoeTab*/(mbody, false);
			}
			
			if (_pitem && _pitem.objtype == "TAB")
			{
				if (_pitem.lt && _pitem.lt.ubody && _pitem.lt.ubody.view &&
					_pitem.lt.ubody.view._ILb/*sheetoption*/ && _pitem.lt.ubody.view._ILb/*sheetoption*/.sf/*taboption*/ &&
					_pitem.lt.ubody.view._ILb/*sheetoption*/.sf/*taboption*/.showtab == "T")
				{
					tabheight = 24;
				}
			}
		}
		
		if (mbody._v && mbody.objtype != "_dc")
		{
			titleh = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(mbody.b2/*boxtitle*/);
		}
		
		item.__titleh = titleh;
				
		me.docitems[item.docid] = item;
		
		fw = item.fw; // (ptp == "top" || ptp == "bottom") ? false : mbody.fw;
		fh = item.fh; // (ptp == "left" || ptp == "right") ? false : mbody.fh;
		
		m.fixedw = nbr.fixed.w; // nbr.fixed.inner.w + nbr.fixed.left.w + nbr.fixed.right.w;
		m.fixedh = nbr.fixed.h; // nbr.fixed.inner.h + nbr.fixed.top.h + nbr.fixed.bottom.h;
		
		m.flexw = nbr.flex.w; // nbr.flex.inner.w + nbr.flex.left.w + nbr.flex.right.w;
		m.flexh = nbr.flex.h; // nbr.flex.inner.h + nbr.flex.top.h + nbr.flex.bottom.h;
		
	
		sw = m.flexw;
		sh = m.flexh;
		pw = m.fixedw;
		ph = m.fixedh;
		
		pos = item.lt.pos;
		
		if (!_pitem)
		{
			pos.x = xx;
			pos.y = yy;
			pos.w = tw;
			pos.h = th;
		}
		else if (_pitem && (_pitem.objtype == "PANEL" || _pitem.objtype == "TAB"))
		{
			tg = 0;
			
			if (_pitem.__titleh && (_pitem.objtype == "PANEL" || _pitem.objtype == "TAB") && (_pitem.lt.ubody._v || me.editmode))
			{
				tg = _pitem.__titleh;
			}
			
			pos.x = xx;
			pos.y = yy + tg + tabheight;
			pos.w = tw;
			pos.h = th - (tg + tabheight);
		}
		else if (_pitem && _pitem.objtype == "_dc")
		{
			
			pos.x = xx + (_pitem._direction == 0 ? _pitem._g : 0);
			pos.y = yy + (_pitem._direction == 1 ? _pitem._g : 0);
			
			if (_pitem._direction == 1)
			{
				pos.w = tw;
			}
			else if (fw)
			{
				pos.w = (item._fw > tw - _pitem._g ? tw - _pitem._g : item._fw);
			}
			else
			{
				pos.w = item._w * (tw - nbr.fixed.w) / nbr.flex.w;
			}
			
			if (_pitem._direction == 0)
			{
				pos.h = th;
			}
			else if (fh)
			{
				pos.h = (item._fh > th - _pitem._g ? th - _pitem._g : item._fh);
			}
			else
			{
				pos.h = item._h * (th - nbr.fixed.h) / nbr.flex.h;
			}
		}
		
		r = mbody.mL/*measureContainer*/.call(mbody);
		
		pos.w = r.m.w > pos.w ? r.m.w : pos.w;
		pos.h = r.m.h > pos.h ? r.m.h : pos.h;
		
		mbody.lt = {
			x: pos.x,
			y: pos.y,
			w: pos.w,
			h: pos.h
		};
		
		item._g = 0;
		
		$.each(item.children, function(i, tp) {
			var s = mbody.lt,
				ubody = tp.lt.ubody;
			
			me.L1k/*updateLayout*/.call(me, tp, s.x, s.y, s.w, s.h, i, r, rect, item);
			item._g += item._direction == 0 ? tp.lt.pos.w : tp.lt.pos.h;
			
			if (i > 0)
			{
				var splitter = new IG$/*mainapp*/.sp/*docksplit*/({
					docmain: me,
					mondrian: true,
					panel: tp,
					direction: item._direction ? "horizontal" : "vertical"
				});
				me.b5/*splitters*/.push(splitter);
			}
		});
		
		b1 = mbody.b1/*box*/;
		
		b1.removeClass("ic-top");
		b1.removeClass("ic-left");
		b1.removeClass("ic-right");
		b1.removeClass("ic-bottom");
		
		iscontainer = me.ic/*iscontainer*/(mbody.objtype);
			
		if (!bmax)
		{
			pos.x == 0 && b1.addClass("ic-left");
			pos.y == 0 && b1.addClass("ic-top");
			pos.x + pos.w > rect.w - 10 && b1.addClass("ic-right");
			pos.y + pos.h > rect.h - 10 && b1.addClass("ic-bottom");
		}
		
		_mp = {
			left: (bmax ? rect.x : pos.x),
			top: (bmax ? rect.y : pos.y),
			width: (bmax ? rect.w : pos.w),
			height: (bmax ? rect.h : pos.h),
			zIndex: (mbody.objtype == "_dc" ? 0 : (iscontainer ? 1 : 2))
		};
		
		if (mbody._$1/*invalidate*/ || !b1.__ps || (b1.__ps && (b1.__ps.top != _mp.top || b1.__ps.left != _mp.left || b1.__ps.width != _mp.width || b1.__ps.height != _mp.height)))
		{
			mbody._$1/*invalidate*/ = 0;
			
			b1.css(_mp);
			
			if (mbody.objtype == "_dc" || ishidden)
			{
				b1.hide();
			}
			else
			{
				b1.show();
				// mbody.b1/*box*/.trigger("resize");
			}
			
			b1.__ps = _mp;
			b1._invl = 1;
		}
	},
	
	l14/*validateSplit*/: function() {
		var me = this,
			b5/*splitters*/ = me.b5/*splitters*/,
			splitter,
			i;
			
		for (i=0; i < b5/*splitters*/.length; i++)
		{
			splitter = b5/*splitters*/[i];
			splitter.l6/*validate*/.call(splitter);
			splitter.spui.css("zIndex", 3); //me.sindex++);
			
			splitter.setV(splitter.p2/*panel*/ && splitter.p2/*panel*/.visible != false);
		}
	},

	// drag drop support
	l3/*showDropProxy*/: function(event, ui) {
		var me = this,
			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(me.b1/*box*/),
			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(me.b1/*box*/),
			proxy = me.b4/*dropproxy*/,
			i,
			item;
		
		// add drop proxy for panel drop
		
		for (i=0; i < me.items.length; i++)
		{
			item = me.items[i];
			item.l3/*showDropProxy*/.call(item);
		}
	},
	
//	l16/*updateDropProxy*/: function() {
//		var me = this,
//			b = me.b4/*dropproxy*/,
//			w = IG$/*mainapp*/.x_10/*jqueryExtension*/._w(b),
//			h = IG$/*mainapp*/.x_10/*jqueryExtension*/._h(b),
//			m = 10, p = 40;
//		
//		b.children("div.dock-top-north").css({top: m, left: (w - p) / 2});
//		b.children("div.dock-top-south").css({bottom: m, left: (w - p) / 2});
//		b.children("div.dock-top-east").css({right: m, top: (h - p) / 2});
//		b.children("div.dock-top-west").css({left: m, top: (h - p) / 2});
//	},
	
	l4/*hideDropProxy*/: function() {
		var i,
			me = this,
			item;
		
		if (me.b4/*dropproxy*/)
		{
			// this.dropproxy.remove();
			// this.dropproxy = null;
			me.b4/*dropproxy*/.hide();
		}
		
		if (me.dockinsg)
		{
			me.dockinsg.hide();
		}
		
		for (i=0; i < me.items.length; i++)
		{
			item = me.items[i];
			item.l4/*hideDropProxy*/.call(item);
		}
	},
	
	l17/*dragOver*/: function(event, ui) {
		var me = this,
			pt = {
				x: event.pageX,
				y: event.pageY
			},
			loc,
			i,
			dnode,
			cnode,
			dragui,
			subhit,
			item,
			b0/*basecontainer*/ = $(me.b0/*basecontainer*/),
			gap = {
				top: b0/*basecontainer*/.scrollTop(),
				left: b0/*basecontainer*/.scrollLeft()
			};
			
		for (i=0; i < me.items.length; i++)
		{
			item = me.items[i];
			item.dDs/*dropOut*/.call(item);
			
			if (item.dragging == true)
			{
				dragui = item;
			}
		}
			
		for (i=0; i < me.items.length; i++)
		{
			item = me.items[i];
			loc = item.dx/*dropHit*/(pt, true, null, gap);
			if (loc && loc != "none" && item.dragging == false)
			{
				dnode = me.docitems[item.docid];
				cnode = dnode.parent;
				
				while (cnode)
				{
					if (cnode.loc == "inner" && cnode.docid == dragui.docid)
					{
						loc = "none";
						break;
					}
					cnode = cnode.parent;
				}
				
				if (loc == "_panel_")
				{
					if (dnode)
					{
						subhit = me.C/*getSubHit*/(dnode, pt, 0);
						
						if (subhit && subhit.dhit && subhit.dhit != "none")
						{
							if (dragui.docid != subhit.ditem.docid)
							{
								subhit.ditem.dD/*dropIn*/.call(subhit.ditem, subhit.dhit);
							}
							break;
						}
					}
				}
				else if (loc != "none")
				{
					if (dragui.docid != item.docid)
					{
						item.dD/*dropIn*/.call(item, loc);
					}
					break;
				}
			}
		}
	},
	
	C/*getSubHit*/: function(ditem, pt, seq) {
		var i, j,
			dobj,
			dhit,
			me = this,
			r = {
				dhit: null,
				ditem: null
			},
			citem,
			b0/*basecontainer*/ = $(me.b0/*basecontainer*/),
			gap = {
				top: b0/*basecontainer*/.scrollTop(),
				left: b0/*basecontainer*/.scrollLeft()
			};
		
		if (!ditem.children)
		{
			return r;
		}
		
		for (i=0; i < ditem.children.length; i++)
		{
			citem = ditem.children[i];
			if (citem.objtype == "_dc")
			{
				r = me.C/*getSubHit*/(citem, pt, 1);
			}
			else
			{
				dobj = citem.lt.ubody;
				dhit = dobj.dx/*dropHit*/.call(dobj, pt, true, true, gap);
				
				if (dhit && dhit != "none" && dhit != "_panel_")
				{
					r.dhit = dhit;
					r.ditem = dobj;
					break;
				}
				else 
				{
					r = me.C/*getSubHit*/(citem, pt, 1);
				}
			}
						
			if (r.dhit)
			{
				break;
			}
		}
		
		return r;
	},
	
	l18/*dragStop*/: function(event, ui) {
		var me = this,
			pt = {
				x: event.pageX,
				y: event.pageY
			},
			i,
			item,
			dhit,
			dragui,
			cindex,
			cnode,
			dnode,
			arr, barr,
			isparent, bs,
			subhit,
			iscontainer = false,
			b0/*basecontainer*/ = $(me.b0/*basecontainer*/),
			gap = {
				top: b0/*basecontainer*/.scrollTop(),
				left: b0/*basecontainer*/.scrollLeft()
			}, __iserror = 0,
			_pnode, _pproc,
			_d, is_before = 0, _nc, _nc2, seq, cpp;
			
		for (i=0; i < me.items.length; i++)
		{
			if (me.items[i].dragging == true)
			{
				dragui = me.items[i];
				cindex = i;
				break;
			}
		}
		
		if (dragui)
		{
			dragui._$1/*invalidate*/ = 1;
		}
		
		for (i=0; i < me.items.length; i++)
		{
			dhit = me.items[i].dx/*dropHit*/(pt, true, null, gap);
			if (dhit && dhit != "none" && me.items[i].dragging == false)
			{
				if (dhit == "_panel_")
				{
					dnode = me.docitems[me.items[i].docid];
					
					if (dnode)
					{
						subhit = me.C/*getSubHit*/(dnode, pt, 0);
						
						if (subhit && subhit.dhit && subhit.dhit != "none")
						{
							dhit = subhit.dhit;
							item = subhit.ditem;
							break;
						}
					}
				}
				else
				{
					item = me.items[i];
					break;
				}
			}
		}
			
		me.l4/*hideDropProxy*/();
		
		if (item && dhit != "none")
		{
			cnode = me.docitems[item.docid];
			dnode = me.docitems[dragui.docid];
			
			switch (dhit)
			{
			case "top":
			case "bottom":
				_d = 1;
				break;
			case "left":
			case "right":
				_d = 0;
				break;
			}
			
			if (dnode.objtype == "TAB" || dnode.objtype == "PANEL")
			{
				_pnode = cnode.parent;
				
				while (_pnode)
				{
					if (_pnode.docid == dnode.docid)
					{
						me._IM5/*updateDisplay*/();
						return;
					}
					
					_pnode = _pnode.parent;
				}
			}
			
			if (dhit == "top" || dhit == "left")
			{
				is_before = 1;
			}
			
			if (dhit == "inner")
			{
				for (i=0; i < dnode.parent.children.length; i++)
				{
					if (dnode.parent.children[i] == dnode)
					{
						dnode.parent.children.splice(i, 1);
						break;
					}
				}
				
				if (cnode.objtype == "PANEL")
				{
					if (cnode.children.length == 0)
					{
						_nc = {
							objtype: "_dc",
							docid: null,
							iscontainer: true,
							_direction: 0,
							children: [],
							width: 0,
							height: 0,
							parent: cnode
						};
						
						me.mK/*processLayoutItem*/(_nc, true, null, null);
						
						cnode.children.push(_nc);
					}
					else
					{
						_nc = cnode.children[0];
					}
					
					dnode.parent = _nc;
					_nc.children.push(dnode);
				}
				else if (cnode.objtype == "TAB")
				{
					dnode.parent = cnode;
					cnode.children.push(dnode);
				}
			}
			else if (cnode.parent.objtype == "TAB")
			{
				_nc = {
					objtype: "PANEL",
					docid: null,
					iscontainer: true,
					_direction: 0,
					children: [],
					width: 0,
					height: 0,
					parent: cnode.parent
				};
				
				me.mK/*processLayoutItem*/(_nc, true, null, null);
				
				me.CV/*createView*/(_nc.lt.ubody, null);
				
				for (i=0; i < cnode.parent.children.length; i++)
				{
					if (cnode.parent.children[i] == cnode)
					{
						cnode.parent.children.splice(i, 1, _nc);
						break;
					}
				}
				
				_nc2 = {
					objtype: "_dc",
					docid: null,
					iscontainer: true,
					_direction: _d,
					children: [],
					width: 0,
					height: 0,
					parent: _nc
				};
				
				me.mK/*processLayoutItem*/(_nc2, true, null, null);
				
				_nc.children.push(_nc2);
				
				for (i=0; i < dnode.parent.children.length; i++)
				{
					if (dnode.parent.children[i] == dnode)
					{
						dnode.parent.children.splice(i, 1);
						break;
					}
				}
				
				if (dnode.parent.children.length == 0)
				{
					me.l8/*removeBox*/(dnode.parent.docid, 1);
				}
				
				cnode.parent = _nc2;
				dnode.parent = _nc2;
				
				if (is_before)
				{
					_nc2.children.push(dnode);
					_nc2.children.push(cnode);
				}
				else
				{
					_nc2.children.push(cnode);
					_nc2.children.push(dnode);
				}
			}
			else if (cnode.parent._direction == _d)
			{
				for (i=0; i < dnode.parent.children.length; i++)
				{
					if (dnode.parent.children[i] == dnode)
					{
						dnode.parent.children.splice(i, 1);
						break;
					}
				}
				
				for (i=0; i < cnode.parent.children.length; i++)
				{
					if (cnode.parent.children[i] == cnode)
					{
						cnode.parent.children.splice((is_before ? i : i+1), 0, dnode);
						break;
					}
				}
				
				if (dnode.parent.objtype != "TAB" && dnode.parent.children.length == 0)
				{
					me.l8/*removeBox*/(dnode.parent.docid, 1);
				}
				
				dnode.parent = cnode.parent;
			}
			else
			{
				_nc = {
					objtype: "_dc",
					docid: null,
					iscontainer: true,
					_direction: _d,
					children: [],
					width: 0,
					height: 0,
					parent: cnode.parent
				};
				
				me.mK/*processLayoutItem*/(_nc, true, null, null);
				
				for (i=0; i < dnode.parent.children.length; i++)
				{
					if (dnode.parent.children[i] == dnode)
					{
						dnode.parent.children.splice(i, 1);
						break;
					}
				}
				
				cpp = cnode.parent;
				
				for (i=0; i < cpp.children.length; i++)
				{
					if (cpp.children[i] == cnode)
					{
						cpp.children.splice(i, 1, _nc);
						break;
					}
				}
				
				if (dnode.parent.objtype != "TAB" && dnode.parent.children.length == 0)
				{
					me.l8/*removeBox*/(dnode.parent.docid, 1);
				}
				
				cnode.parent = _nc;
				dnode.parent = _nc;
				
				if (_d == 0)
				{
					dnode.lt.ubody.width = cnode.lt.ubody.width;
				}
				else
				{
					dnode.lt.ubody.height = cnode.lt.ubody.height;
				}
				
				if (is_before)
				{
					_nc.children.push(dnode);
					_nc.children.push(cnode);
				}
				else
				{
					_nc.children.push(cnode);
					_nc.children.push(dnode);
				}
			}
		}
		
		this._IM5/*updateDisplay*/();
	},
	
	A/*resizeContainer*/: function(items) {
		var me = this;
		
		$.each(items, function(i, k) {
			me._rc/*changecontainer*/.call(me, k, k.lt.pos.w, k.lt.pos.h);
		});
	},
	
	_rc/*changecontainer*/: function(item, w, h) {
		var me = this,
			i,
			objtype = item.objtype,
			children = item.children,
			sobj,
			tw = 0, th = 0, fw = 0, fh = 0, lw, lh;
			
		me._rcS/*setSize*/(item, w, h);
		
		if (objtype == "_dc")
		{
			for (i=0; i < children.length; i++)
			{
				sobj = children[i];
				if (item._direction) // vertical
				{
					tw = w;
					
					if (sobj.fh)
					{
						fh += sobj.lt.pos.h;
					}
					else
					{
						th += sobj.lt.pos.h;
					}
				}
				else // horizontal
				{
					if (sobj.fw)
					{
						fw += sobj.lt.pos.w;
					}
					else
					{
						tw += sobj.lt.pos.w;
					}
					
					th = h;
				}
			}
			
			for (i=0; i < children.length; i++)
			{
				sobj = children[i];
				lw = 0;
				lh = 0;
				
				if (item._direction)
				{
					lw = tw;
					if (sobj.fh)
					{
						lh = sobj._fh;
					}
					else if (h && th && sobj.lt.pos.h)
					{
						lh = (sobj.lt.pos.h / th) * (h - fh);
					}
				}
				else
				{
					if (sobj.fw)
					{
						lw = sobj._fw;
					}
					else if (w && tw && sobj.lt.pos.w)
					{
						// lw = w > 0 && tw > 0 ? (children[i].lt.pos.w / tw) * w : 0;
						lw = (sobj.lt.pos.w / tw) * (w - fw);
						
					}
					
					lh = th;
				}
				me._rc/*changecontainer*/(children[i], w > 0 ? lw : 0, h > 0 ? lh : 0);
			}
		}
		else if (objtype == "PANEL")
		{
			if (children && children.length)
			{
				for (i=0; i < children.length; i++)
				{
					me._rc/*changecontainer*/(children[i], w, h);
				}
			}
		}
		else if (objtype == "TAB")
		{
			if (children && children.length)
			{
				for (i=0; i < children.length; i++)
				{
					me._rc/*changecontainer*/(children[i], w, h);
				}
			}
		}
	},
	
	_rcS/*setSize*/: function(item, w, h) {
		if ( w > 0)
		{
			item.lt.pos.w = w;
			item.lt.ubody.width = w;
		}
		
		if (h > 0)
		{
			item.lt.pos.h = h;
			item.lt.ubody.height = h;
		}
	},
	
	B/*updateNodeSize*/: function(_nc) {
		var me = this,
			i,
			_d,
			ubody = _nc.lt.ubody,
			fw, fh,
			sobj,
			sbody, sfw, sfh;
		
		_nc._w = 0;
		_nc._h = 0;
		_nc._fw = 0;
		_nc._fh = 0;
		_nc._mw = 0;
		_nc._mh = 0;
		
		fw = ubody.fw;
		fh = ubody.fh;
		
		_nc.fw = fw;
		_nc.fh = fh;
					
		if (_nc.objtype == "_dc")
		{
			_d = _nc._direction;
			
			for (i=0; i < _nc.children.length; i++)
			{
				sobj = _nc.children[i];
				sbody = sobj.lt.ubody;
				
				me.B/*updateNodeSize*/(sobj);
								
				if (_d == 0)
				{
					if (sobj.fh)
					{
						_nc._fh = Math.max(sobj._fh, _nc._fh);
					}
					
					if (sobj.fw && _nc._fw > -1)
					{
						_nc._fw += sobj._fw;
					}
					else
					{
						_nc._fw = -1;
					}
				}
				else if (_d == 1)
				{
					if (sobj.fw)
					{
						_nc._fw = Math.max(sobj._fw, _nc._fw);
					}
					
					if (sobj.fh && _nc._fh > -1)
					{
						_nc._fh += sobj._fh;
					}
					else
					{
						_nc._fh = -1;
					}
				}
			}
			
			if (_nc._fw > 0 || _nc._fh > 0)
			{
				me._rc/*changecontainer*/(_nc, _d == 1 && _nc._fw > 0 ? _nc._fw : 0, _d == 0 && _nc._ff > 0 ? _nc._fh : 0);
				
				_nc.fw = (_nc._fw > 0 ? 1 : 0);
				_nc.fh = (_nc._fh > 0 ? 1 : 0);
			}
			
			_nc._fw = 0;
			_nc._fh = 0;
			
			for (i=0; i < _nc.children.length; i++)
			{
				sobj = _nc.children[i];
				sbody = sobj.lt.ubody;
				
				me.B/*updateNodeSize*/(sobj);
								
				if (_d == 0)
				{
					if (sobj.fh)
					{
						_nc._fh = Math.max(sobj._fh, _nc._fh);
						
					}
					else if (!_nc.fh)
					{
						_nc._h = Math.max(sobj._h, _nc._h, sobj._fh);
					}
					
					_nc._mh = Math.max(30, _nc._mh, sobj._mh, sobj._fh);
					
					if (sobj.fw)
					{
						_nc._fw += sobj._fw;
						_nc._mw += sobj._mw;
					}
					else
					{
						_nc._w += sobj._w;
						_nc._mw += 30;
					}
				}
				else if (_d == 1)
				{
					if (sobj.fw)
					{
						_nc._fw = Math.max(sobj._fw, _nc._fw);
					}
					else if (!_nc.fw)
					{
						_nc._w = Math.max(sobj._w, _nc._w, sobj._fw);
					}
					
					_nc._mw = Math.max(30, _nc._mw, sobj._mw, sobj._fw);
					
					if (sobj.fh)
					{
						_nc._fh += sobj._fh;
						_nc._mh += sobj._mh;
					}
					else
					{
						_nc._h += sobj._h;
						_nc._mh += 30;
					}
				}
			}
		}
		else if (_nc.objtype == "PANEL" || _nc.objtype == "TAB")
		{
			_nc.children = _nc.children || [];
			
			ubody.width = ubody.width > 0 ? ubody.width : 30;
			ubody.height = ubody.height > 0 ? ubody.height : 30;
			
			for (i=0; i < _nc.children.length; i++)
			{
				sobj = _nc.children[i];
				me.B/*updateNodeSize*/(sobj);
				
				if (_nc.objtype == "TAB")
				{
					_nc._fw = Math.max(sobj._fw, _nc._fw);
					_nc._fh = Math.max(sobj._fh, _nc._fh);
					_nc._w = Math.max(sobj._w, _nc._w);
					_nc._h = Math.max(sobj._h, _nc._h);
				}
				else
				{
					_nc._fw += sobj._fw;
					_nc._fh += sobj._fh;
					_nc._w += sobj._w;
					_nc._h += sobj._h;
				}
			}
			
			if (fw)
			{
				_nc._fw = ubody.width;
				_nc._mw = _nc._fw;
			}
			else
			{
				_nc._w = ubody.width;
				_nc._mw = 30;
			}
			
			if (fh)
			{
				_nc._fh = ubody.height;
				_nc._mh = _nc._fh;
			}
			else
			{
				_nc._h = ubody.height;
				_nc._mh = 30;
			}
		}
		else
		{
			ubody.width = ubody.width > 0 ? ubody.width : 30;
			ubody.height = ubody.height > 0 ? ubody.height : 30;
				
			if (fw)
			{
				_nc._fw = ubody.width;
				_nc._mw = _nc._fw;
			}
			else
			{
				_nc._w = ubody.width;
				_nc._mw = 30;
			}
			
			if (fh)
			{
				_nc._fh = ubody.height;
				_nc._mh = _nc._fh;
			}
			else
			{
				_nc._h = ubody.height;
				_nc._mh = 30;
			}
		}
	}
};
IG$/*mainapp*/.BC$base/*hadoop_dlg_base*/ = $s.extend($s.panel, {
	
	region:"center",
	"layout": "fit",
			
	callback: null,
	
	_IFe/*initF*/: function() {
		var me = this,
			job = me.job;
			
		if (job)
		{
			me.down("[name=dsname]").setValue(job.dsname);
			me.down("[name=dsdesc]").setValue(job.dsdesc);
			me.down("[name=dsignoreerror]").setValue(job.dsignoreerror == "T" ? true : false);
			
			me.rL/*refreshLog*/();
		}
	},
	
	
	_IFf/*confirmDialog*/: function() {
		var me = this,
			job = me.job;
			
		if (job)
		{
			job.dsname = me.down("[name=dsname]").getValue();
			job.dsdesc = me.down("[name=dsdesc]").getValue();
			job.dsignoreerror = me.down("[name=dsignoreerror]").getValue() == true ? "T" : "F";
		}
		
		me._IG0/*closeDlgProc*/();
	},
	
	_IG0/*closeDlgProc*/: function() {
		var me = this;
		
		me.callback && me.callback.execute(me.job);
		
		me.fireEvent("close_dlg", me);
	},
	
	rL/*refreshLog*/: function() {
		if (this.job && this.job.sid)
		{
			var me = this,
				lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
			lreq.init(me, 
				{
		            ack: "10",
		            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({sid: me.job.sid}, "sid"),
		            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "logcontent"})
				}, me, me.rs_rL/*refreshLog*/, false);
				
			lreq._l/*request*/();
		}
	},
	
	rs_rL/*refreshLog*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes = (tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null),
			i, logs = [], l,
			grdloghist = me.down("[name=grdloghist]"),
			pdesc,
			duration, m, s, ms;
			
		if (tnodes)
		{
			for (i=0; i < tnodes.length; i++)
			{
				l = IG$/*mainapp*/._I1c/*XGetAttrProp*/(tnodes[i]);
				l.pstatus = parseInt(l.pstatus);
				l.created_desc = IG$/*mainapp*/._I40/*formatDate*/(l.created);
				l.updated_desc = IG$/*mainapp*/._I40/*formatDate*/(l.updated);
				duration = Number(l.duration);
				duration = isNaN(duration) ? null : duration;
				if (duration != null)
				{
					m = Math.floor(duration / (60*1000));
					duration -= m * (60*1000);
					s = Math.floor(duration / (1000));
					duration -= s * (1000);
					ms = duration;
					l.duration = (m>0 ? m + "m " : "") + (s>0 ? s + "s " : "") + (ms>-1 ? ms + "ms" : "");
				}
				pdesc = "Unknown";
				switch (l.pstatus)
				{
				case 1:
					pdesc = "Running";
					break;
				case 10:
					pdesc = "Completed";
					break;
				case 20:
					pdesc = "Error: No result";
					break;
				case 21:
					pdesc = "Error: Dataformat mismatch";
					break;
				case 29:
					pdesc = "Error: Execution failed";
					break;
				}
				
				l.pstatus_desc = pdesc;
				logs.push(l);
			}
		}
		
		grdloghist.store.loadData(logs);
	},
	
	g1/*getLogDetail*/: function(lid) {
		var me = this,
			lreq = new IG$/*mainapp*/._I3e/*requestServer*/();
		lreq.init(me, 
			{
	            ack: "10",
	            payload: IG$/*mainapp*/._I2d/*getItemAddress*/({lid: lid}, "lid"),
	            mbody: IG$/*mainapp*/._I2e/*getItemOption*/({option: "logdetail"})
			}, me, me.rs_g1/*getLogDetail*/, false);
			
		lreq._l/*request*/();
	},
	
	rs_g1/*getLogDetail*/: function(xdoc) {
		var me = this,
			tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
			tnodes = tnode ? IG$/*mainapp*/._I26/*getChildNodes*/(tnode) : null,
			errmsg,
			snode,
			msg, i, tmsg,
			haserr = false;
			
		if (tnodes)
		{
			for (i=0; i < tnodes.length; i++)
			{
				snode = IG$/*mainapp*/._I19/*getSubNode*/(tnodes[i], "errormessage");
				
				if (snode)
				{
					msg = IG$/*mainapp*/._I24/*getTextContent*/(snode);
					msg = Base64.decode(msg);
					haserr = true;
				}
				else
				{
					snode = IG$/*mainapp*/._I19/*getSubNode*/(tnodes[i], "message");
					if (snode)
					{
						msg = IG$/*mainapp*/._I24/*getTextContent*/(snode);
						msg = Base64.decode(msg);
					}
				}
				
				tmsg = (tmsg) ? tmsg + "\n" + msg : msg;
			}
			
			me.down("[name=logdetail]").setValue(tmsg);
						
			if (haserr == true)
			{
				IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, "One or more command failed. See log for detail", null, me, 1, "error");
			}
		}
	},
	
	GG1/*getMapClasses*/: function(field) {
		var dlgitemsel = new IG$/*mainapp*/._I96/*metaSelectDlg*/({
			visibleItems: 'javapackage;folder;javaclass',
			u5x/*treeOptions*/: {
				cubebrowse: false,
				rootuid: "/BusinessLogic",
				visibleItems: 'javapackage;folder;javaclass'
			},
			callback: new IG$/*mainapp*/._I3d/*callBackObj*/(this, this.rs_GG1/*getMapClasses*/, field)
		});
		IG$/*mainapp*/._I_5/*checkLogin*/(this, dlgitemsel);
	},
	
	rs_GG1/*getMapClasses*/: function(item, field) {
		var tname = "",
			cpath;
		
		if (item && item.nodepath)
		{
			cpath = item.nodepath;
			cpath = cpath.split("/");
			cpath.splice(0, 2);
			
			tname = cpath.join(".");
		}
		field.setValue(tname);
	},
		
	initComponent : function() {
		var panel = this,
			bsitem = [],
			i;
		
		panel.title = panel.title || IRm$/*resources*/.r1("T_BG_DS");
		panel.addEvents("close_dlg");
		
		bsitem.push({
			xtype: "fieldset",
			title: "Basic Option",
			layout: "anchor",
			defaults: {
				anchor: "100%",
				labelAlign: "top"
			},
			items: [
				{
					xtype: "textfield",
					name: "dsname",
					fieldLabel: "Name"
				},
				{
					xtype: "textarea",
					name: "dsdesc",
					fieldLabel: "Description"
				},
				{
					xtype: "checkbox",
					name: "dsignoreerror",
					hidden: panel.hide_ierr ? true : false,
					fieldLabel: "Ignore Error",
					labelAlign: "left",
					boxLabel: "Ignore and continue"
				}
			]
		});
		
		if (panel.moption)
		{
			for (i=0; i < panel.moption.length; i++)
			{
				bsitem.push(panel.moption[i]);
			}
		}
		
		$s.apply(this, {
			defaults:{bodyStyle:"padding:3px"},
			
			items: [
				{
					xtype: "tabpanel",
					layout: "fit",
					items: [
						{
							xtype: "form",
							layout: "anchor",
							title: "Configuration",
							autoScroll: true,
							defaults: {
								anchor: "100%"
							},
							items: bsitem
						},
						{
							xtype: "form",
							title: "History",
							hidden: panel.s_hist == 0,
							layout: {
								type: "vbox",
								align: "stretch"
							},
							items: [
								{
									xtype: "fieldset",
									title: "Execute Log",
									layout: "fit",
									flex: 1,
									items: [
										{
											xtype: "gridpanel",
											name: "grdloghist",
											store: {
												xtype: "store",
												fields: [
													"sid", "lid", "jobtype", "pstatus", "created", "updated",
													"pstatus_desc", "created_desc", "updated_desc", "duration"
												]
											},
											columns: [
												{
													xtype: "gridcolumn",
													text: "Start time",
													flex: 1,
													dataIndex: "created_desc"
												},
												{
													xtype: "gridcolumn",
													text: "End time",
													flex: 1,
													dataIndex: "updated_desc"
												},
												{
													xtype: "gridcolumn",
													text: "Duration",
													dataIndex: "duration",
													flex: 1
												},
												{
													xtype: "gridcolumn",
													text: "Status",
													width: 120,
													dataIndex: "pstatus_desc"
												}
											],
											tbar: [
												{
													xtype: "button",
													text: "Refresh",
													handler: function() {
														var me = this;
														me.rL/*refreshLog*/();
													},
													scope: this
												}
											],
											listeners: {
												itemclick: function(view, record, item, index, e) {
													var lid = record.get("lid");
													
													if (lid)
													{
														this.g1/*getLogDetail*/(lid);
													}
												},
												scope: this
											}
										}
									]
								},
								{
									xtype: "fieldset",
									title: "Log Details",
									layout: "fit",
									flex: 2,
									items: [
										{
											xtype: "textarea",
											name: "logdetail"
										}
									]
								}
							]
						},
						{
							xtype: "panel",
							hidden: (panel.s_hist != 0),
							title: "Probability",
							layout: {
								type: "vbox",
								align: "stretch"
							},
							items: [
							    {
							    	xtype: "fieldcontainer",
							    	fieldLabel: "Relation Type",
							    	layout: "hbox",
							    	items: [
										{
											xtype: "combobox",
											name: "potential_type",
											labelWidth: 80,
											width: 200,
											queryMode: 'local',
											displayField: 'name',
											valueField: 'value',
											editable: false,
											autoSelect: true,
											store: {
												xtype: 'store',
												fields: [
													"name", "value"
												]
											}
										},
										{
											xtype: "button",
											text: "Reorder Potential"
										}
							    	]
							    },
							    {
							    	xtype: "fieldcontainer",
							    	layout: "hbox",
							    	items: [
								    	{
								    		xtype: "button",
								    		text: "Edit mean potentail"
								    	},
								    	{
								    		xtype: "button",
								    		text: "Edit variance potential"
								    	}
							    	]
							    },
								{
							    	xtype: "gridpanel",
									hideHeaders: false,
									columnLines: true,
									name: "g_p1",
									viewConfig : {
										enableTextSelection : true,
										ForceFit : true,
										loadMask : true
									},
									flex: 1,
									columns: [
										
									]
								}
							]
						}
					]
				}
			],
			buttons:[
				
				"->",
				{
					text: IRm$/*resources*/.r1("B_CONFIRM"),
					handler: function() {
						this._IFf/*confirmDialog*/();
					},
					scope: this
				}, {
					text: IRm$/*resources*/.r1("B_CANCEL"),
					handler:function() {
						// this.close();
						var me = this;
						me.fireEvent("close_dlg", me);
					},
					scope: this
				}
			],
			listeners: {
				afterrender: function(ui) {
					var panel = this;
					panel._IFe/*initF*/();
				}
			}
		});
		
		IG$/*mainapp*/.BC$base/*hadoop_dlg_base*/.superclass.initComponent.apply(this, arguments);
	}
});

