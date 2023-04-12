/*
amplixbi.com on MPLIX project
Copyright(c) 2011 amplixbi.com
http://www.amplixbi.com/
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
IG$/*mainapp*/._I84/*checkLogin*/ = function(sccall, fail) {
	$.ajax({
		url: ig$/*appoption*/.servlet,
		
		data: {
			ack: "14",
			payload: "<smsg ptoken='' uuid=''></smsg>",
			mbody: "<smsg><option lang='" + useLocale + "' app='" + loadingApp + "'/></smsg>",
			uniquekey: IG$/*mainapp*/._I4a/*getUniqueKey*/()
		},
		type: "POST",
		dataType: "text",
		timeout: 30000,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		beforeSend: function(xhr, settings) {
		},
		cache: false,
		crossDomain: false,
		processData: true,
		error: function() {
			alert("Error while connecting server");
			if (fail)
			{
				fail.call();
			}
		},
		success: function(doc) {
			var xdoc = IG$/*mainapp*/._I13/*loadXML*/(doc),
				root = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
				item = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
				ltoken,
				nuid,
				redirect;
			
			if (item)
			{
				ltoken = IG$/*mainapp*/._I1b/*XGetAttr*/(item, "token");
				nuid = IG$/*mainapp*/._I1b/*XGetAttr*/(item, "uid");
				
				redirect = IG$/*mainapp*/._I1b/*XGetAttr*/(item, "redirect");
				
				if (sccall)
				{
					sccall.call();
				}
				else if (redirect && redirect.length > 0)
				{
					window.location.replace(redirect);
				}
			}
			else
			{
				if (fail)
				{
					fail.call();
				}
			}
		}
	});
}

IG$/*mainapp*/._I85/*processLogin*/ = function(userid, passwd, bg, mts, errcallback) {
	if (bg)
	{
		bg.show();
	}
	
	var il_err = $("#il_err");
	il_err.hide();
	
	$.ajax({
		url: ig$/*appoption*/.servlet,
		type: "POST",
		data: {
			ack: "23",
			payload: "<smsg mts='" + (mts || "") + "'></smsg>",
			mbody: "<smsg></smsg>",
			uniquekey: IG$/*mainapp*/._I4a/*getUniqueKey*/()
		},
		dataType: "text",
		timeout: 30000,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		beforeSend: function(xhr, settings) {
		},
		cache: false,
		crossDomain: false,
		processData: true,
		timeout: 300000,
		error: function() {
			bg.hide();
			alert("Error while connecting server");
		},
		success: function(doc) {
			var xdoc = IG$/*mainapp*/._I13/*loadXML*/(doc),
				root = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
				item = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
				p1, p2;
			
			if (item)
			{
				p1 = IG$/*mainapp*/._I1a/*getSubNodeText*/(item, "p1");
				p2 = IG$/*mainapp*/._I1a/*getSubNodeText*/(item, "p2");
				
				if (p1 && p2)
				{
					IG$/*mainapp*/._I3a/*rsaPublicKeyModulus*/ = p1;
					IG$/*mainapp*/._I3b/*rsaPpublicKeyExponent*/ = p2;
					IG$/*mainapp*/._g$a/*global_mts*/ = IG$/*mainapp*/._I1b/*XGetAttr*/(item, "mts");
					
					setTimeout(function() {
						IG$/*mainapp*/._I86/*processLoginRSA*/(userid, passwd, bg, mts, errcallback);
					}, 10);
				}
				else
				{
					alert("Error while get security key");
					if (bg)
					{
						bg.hide();
					}
				}
			}
			else if (root)
			{
				var errcode = IG$/*mainapp*/._I1b/*XGetAttr*/(root, "errorcode"),
					msg = IG$/*mainapp*/._I1b/*XGetAttr*/(root, "errormsg");
				
				if (errcode)
				{
					if (bg)
					{
						bg.hide();
					}
					
	            	if (errcode == "0x6d00")
	            	{
	            		il_err.unbind("click");
	            		il_err.bind("click", function() {
	            			il_err.hide();
	            		});
	            		il_err.show();
	            		$(".igc-errorinfo-msg", il_err).html(msg);
	            	}
	            	else
	            	{
	            		IG$/*mainapp*/._I51/*ShowErrorMessage*/(xdoc, null);
	            	}
				}
			}
		}
	});
}

IG$/*mainapp*/._I86/*processLoginRSA*/ = function(userid, passwd, bg, mts, errcallback)
{
	var encpwd = IG$/*mainapp*/._I3c/*encryptkey*/([userid, passwd]); // CryptoJS.SHA1(passwd);
	// passwd = encpwd.toString(); //(CryptoJS.enc.Hex);
	
	var il_err = $("#il_err");
	il_err.hide();
	
	$.ajax({
		url: ig$/*appoption*/.servlet,
		data: {
			ack: "13",
			payload: "<smsg ptoken='' uuid=''><userid><![CDATA[" + encpwd[0] + "]]></userid><passwd><![CDATA[" + encpwd[1] + "]]></passwd></smsg>",
			mbody: "<smsg><option lang='" + useLocale + "' app='" + loadingApp + "' session_expire='" + (ig$/*appoption*/.session_expire || "0") + "' mts='" + (mts || "") + "'/></smsg>",
			uniquekey: IG$/*mainapp*/._I4a/*getUniqueKey*/()
		},
		type: "POST",
		dataType: "text",
		timeout: 30000,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		beforeSend: function(xhr, settings) {
		},
		cache: false,
		crossDomain: false,
		processData: true,
		timeout: 300000,
		error: function() {
			if (bg)
				bg.hide();
			alert("Error while connecting server");
		},
		success: function(doc) {
			var xdoc = IG$/*mainapp*/._I13/*loadXML*/(doc),
				root = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
				item = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/item"),
				ltoken,
				nuid,
				errcode = root ? IG$/*mainapp*/._I1b/*XGetAttr*/(root, "errorcode") : null,
				redirect;
			
			if (bg)
			{
				bg.hide();
			}
			
			if (item)
			{
				ltoken = IG$/*mainapp*/._I1b/*XGetAttr*/(item, "token");
				nuid = IG$/*mainapp*/._I1b/*XGetAttr*/(item, "uid");
				
				redirect = IG$/*mainapp*/._I1b/*XGetAttr*/(item, "redirect");
					
				if (redirect && redirect.length > 0)
				{
					window.location.replace(redirect);
				}
				else
				{
					alert("System Error:: Application is not defined on config.xml");
				}
			}
			else if (errcode)
			{
				var msg = IG$/*mainapp*/._I1b/*XGetAttr*/(root, "errormsg");
					
				if (errcode == "0x6d00")
            	{
            		il_err.unbind("click");
            		il_err.bind("click", function() {
            			il_err.hide();
            		});
            		il_err.show();
            		$(".igc-errorinfo-msg", il_err).html(msg);
            		
            		errcallback && errcallback.execute();
            	}
            	else if (errcallback)
            	{
            		errcallback.execute();
            	}
            	else
            	{
            		IG$/*mainapp*/._I51/*ShowErrorMessage*/(xdoc, null);
            	}
			}
		}
	});
}

IG$/*mainapp*/._I87/*checkServerInfo*/ = function(callback) {
	if (!ig$/*appoption*/.appInfo)
	{
		$.ajax({
			url: ig$/*appoption*/.servlet,
			data: {
				sreq: "version",
				uniquekey: IG$/*mainapp*/._I4a/*getUniqueKey*/()
			},
			dataType: "text",
			type: "GET",
			timeout: 30000,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			beforeSend: function(xhr, settings) {
			},
			cache: false,
			crossDomain: false,
			processData: true,
			error: function() {
				ig$/*appoption*/.appInfo = {
					appversion: "_._",
					apprelease: "_._.___"
				};
				
				callback && callback.call();
			},
			success: function(doc) {
				var xdoc = IG$/*mainapp*/._I13/*loadXML*/(doc),
					root = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg"),
					tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/info");
				
				ig$/*appoption*/.appInfo = {
					appversion: tnode ? IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "version") : "0.0",
					apprelease: tnode ? IG$/*mainapp*/._I1b/*XGetAttr*/(tnode, "release") : "0.0.000"
				};
				
				callback && callback.call();
			}
		});
	}
	else
	{
		callback && callback.call();
	}
}

IG$/*mainapp*/._I88/*createLoginPanel*/ = function(d1, d2, addevent){
	var loginWindow = $("<div id='loginWindow' class='loginWindow'></div>"),
		i,
		lng = ig$/*appoption*/.lang, l,
		browser = window.bowser;
		
	if (browser.msie)
	{
		loginWindow.css({width: "100%", height: "100%"});
		if (ig$/*appoption*/.appbg)
		{
			var bg = $("<img src='./images/" + (ig$/*appoption*/.appbg) + "' class='background'/>");
			
			bg.css({
				width: "100%", height: "100%", position: "absolute", top: 0, left: 0
			});
			loginWindow.append(bg);
		}
	}
	
	if (lng)
	{
		for (i=0; i < lng.length; i++)
		{
			if (lng[i].code == useLocale)
			{
				l = lng[i];
				break;
			}
		}
	}
	
	// var loginBox = $("<div class='loginBox'></div>").appendTo(loginWindow);
	var loginForm, lf = "<div class='login-mc bounceInDown animated'>"
		+ "<div class='login-ic'>"
		+ "<img class='login-logo' src='./images/logo_7186.png'>"
		+ "<div id='user_lbl'>" + ((l && l.l1) ? l.l1 : "User ID") + "</div>"
		+ "<div id='pass_lbl'>" + ((l && l.l2) ? l.l2 : "Password") + "</div>"
		+ "<form name='login_form' id='login_form' rel='nofollow' target='temp' action=''>"
		+ "	<input id='userid' type='text' name='userid' value='" + (d1 || "") + "'>"
		+ "	<input id='userpassword' type='password' name='userpassword' value='" + (d2 || "") + "'>"
		+ "	<input id='login_btn' type='button' value='" + ((l && l.l3) ? l.l3 : "Login") + "'>"
		+ "</form>"
		+ "<div id='login_locale'><div class='locale_button'><span>Language</span>" // <div class='selbutton'></div>"
		+ "<select id='b_loc'>";
	
	if (lng)
	{
		for (i=0; i < lng.length; i++)
		{
			lf += "<option value='" + lng[i].code + "'" + (useLocale == lng[i].code ? " selected" : "") + ">" + lng[i].disp + "</option>"
		}
	}
		
	lf += "</select></div></div>"
		+ "<div id='license'>Licensed to: MPLIX</div>";

	lf += "</div>"; // login-ic
  	lf += "</div>";
  	
	loginForm = $(lf).appendTo(loginWindow).addClass("loginForm");
  	
	var legal = $("<div class='legal'>"
		+ "<table width='494' border='0' cellpadding='0' cellspacing='0'>"
		+ "  <tr>"
		+ "    <td width='78'>&nbsp;</td>"
		+ "    <td width='416' valign='top'><div align='left'>"
		+ "      <p class='style2'>" + ig$/*appoption*/.copy + "</p>"
		+ "      <p class='style1'><span class='style4'>For support please contact</span>"
		+ "      <a href='" + ig$/*appoption*/.companydomain + "' target='_new'>" + ig$/*appoption*/.companydomain + "</a></p>"
		+ "    </div></td>"
		+ "  </tr>"
		+ "</table></div>").appendTo(loginWindow);

	var build = $("<div class='build'>"
		+ "<div align='right'><span class='style6'>Build Id: <span id='app_release'" + (ig$/*appoption*/.appInfo && ig$/*appoption*/.appInfo.apprelease) + "</span></span></div>"
		+ "</div>").appendTo(loginWindow);
		
	var errorinfo = $("<div id='il_err' class='igc-errorinfo'><div class='igc-errorinfo-msg'></div></div>").appendTo(loginWindow);
	
	var progress = $("<div id='login-progress' class='login-progress'></div>")
		.css({position: "absolute", width:"100%", height: "100%", top: 0, left: 0, right: 0, bottom: 0})
		.hide().appendTo(loginWindow);
	
	if (window.IG$/*mainapp*/.cLogin)
	{
		window.IG$/*mainapp*/.cLogin(loginWindow);
	}
	
	$(document.body).append(loginWindow);
	
	IG$/*mainapp*/._I87/*checkServerInfo*/(function() {
		$("#app_release", build).text(ig$/*appoption*/.appInfo.apprelease);
	});
	
	setTimeout(function() {
		if (d1)
		{
			$("#userpassword").focus();
		}
		else
		{
			$("#userid").focus();
		}
	}, 200);
	
	$("#userpassword").bind("focus", function() {
		$("#userpassword").select();
	});
	
	$("#userid").bind("focus", function() {
		$("#userid").select();
	});
	
	$("#userpassword").bind("mouseup", function() {
		setTimeout(function() {
			$("#userpassword").select();
		}, 80);
	});
	
	$("#userid").bind("mouseup", function() {
		setTimeout(function() {
			$("#userid").select();
		}, 80);
	});
	
	if (addevent !== false)
	{
		$("#b_loc").bind("change", function(e) {
			var b_loc = $("#b_loc"),
				selvalue = $("option:selected", b_loc).val(),
				redirect = $(location).attr('href'),
				p, hv, h = {},
				k, v,
				i, s = false;
				
			if (selvalue && selvalue != window.useLocale)
			{
				if (redirect.indexOf("?") > -1)
				{
					p = redirect.substring(0, redirect.indexOf("?"));
					hv = redirect.substring(redirect.indexOf("?") + 1);
					h = hv.split("&");
					
					for (i=0; i < h.length; i++)
					{
						if (h[i].substring(0, 5) == "lang=")
						{
							h[i] = h[i].substring(0, 5) + selvalue;
							s = true;
							break;
						}
					}
					
					hv = h.join("&");
					
					redirect = p + "?" + hv;
				}
				
				if (s == true)
				{
					progress.show();
					
					setTimeout(function() {
						window.location.replace(redirect);
					}, 100);
				}
			}
		});
		
		$("#login_btn").bind("click", function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			var userid = $("#userid").val(),
				passwd = $("#userpassword").val();
				
			$("#userpassword").val("");
			
	    	IG$/*mainapp*/._I83/*dlgLogin*/.rm1$8/*requestLoginKey*/.call(IG$/*mainapp*/._I83/*dlgLogin*/, userid, passwd, progress, window.m$mts);
			return false;
		});
		
		$("#userpassword").bind("keypress", function(e) {
			if (e.keyCode == 13)
			{
				var userid = $("#userid").val(),
					passwd = $("#userpassword").val();
					
				$("#userpassword").val("");
					
		    	IG$/*mainapp*/._I83/*dlgLogin*/.rm1$8/*requestLoginKey*/.call(IG$/*mainapp*/._I83/*dlgLogin*/, userid, passwd, progress, window.m$mts);
				return false;
			}
			
			return true;
		});
	}
	
	return loginWindow;
}

IG$/*mainapp*/._I89/*showLogin*/ = function(callback, rs)
{
//	if (window.mecapp)
//	{
//		$("#win-mask").css({display: "none"});
//	}
//	else
//	{
//	}
	
	$("#idv-mnu-pnl").hide();
	
	if (IG$/*mainapp*/._I83/*dlgLogin*/)
	{
		IG$/*mainapp*/._I83/*dlgLogin*/.callback = new IG$/*mainapp*/._I3d/*callBackObj*/(this, function() {
			IG$/*mainapp*/._I83/*dlgLogin*/.tl = -1;
			IG$/*mainapp*/._I8b/*showLoginProc*/();
		});
	}
	
	if (window.hist)
	{
		window.hist.addHistory("");
	}
	
	var lform = $("#loginWindow"),
		browser = window.bowser;
		
	lform.css({zIndex: 99});
	if (browser.msie)
	{
		lform.css({position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", margin: 0, padding: 0});
	}
	lform.show();
}

IG$/*mainapp*/._I8a/*showLogout*/ = function(callback)
{
	if (IG$/*mainapp*/.msgint > -1)
	{
		clearInterval(IG$/*mainapp*/.msgint);
		IG$/*mainapp*/.msgint = -1;
	}
	
	IG$/*mainapp*/._I55/*confirmMessages*/(IRm$/*resources*/.r1("B_CONFIRM"), IRm$/*resources*/.r1("L_T_LOUT"), function(dlg) {
		if (dlg == "yes")
		{
			var req = new IG$/*mainapp*/._I3e/*requestServer*/();
			req.init(null, 
				{
			        ack: "15",
			        payload: "",
			        mbody: ""
			    }, null, 
			    function(xdoc){
			    },
			    function(){
			    	return true;
		    });
			
			req._l/*request*/();
			
			IG$/*mainapp*/._I89/*showLogin*/(callback, 1);
		}
	});
}
IG$/*mainapp*/._I51/*ShowErrorMessage*/ = function(doc, parent) {
	var root = IG$/*mainapp*/._I18/*XGetNode*/(doc, "/smsg"),
		errdesc = IG$/*mainapp*/._I1b/*XGetAttr*/(root, "errormsg"),
		errmsg = IG$/*mainapp*/._I24/*getTextContent*/(root);
		
	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, errdesc + "\n\n" + errmsg);
}

IG$/*mainapp*/._I52/*ShowError*/ = function(errdesc, parent) {
	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, errdesc);
}

IG$/*mainapp*/._I53/*ShowConnectionError*/ = function(panel) {
	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_ERR_CONNECT'));
}

IG$/*mainapp*/._I54/*alertmsg*/ = function(title, msg, fn, parent) {
	alert(msg);
}

IG$/*mainapp*/.ppP = function(div) {
	div.getWidth = function() {
		return this.width();
	}
	div.getHeight = function() {
		return this.height();
	}
	
	return div;
}

IG$/*mainapp*/.pp2 = function(f, sopt) {
	f.superclass = new IG$/*mainapp*/.superclass();
	f.prototype = new IG$/*mainapp*/.superclass();
	
	f.initVal = {};

	for (var k in sopt)
	{
		var kval = sopt[k],
			kt = typeof(kval);
		
			
		if (kt == "function")
		{
			f.prototype[k] = kval;
		}
		else
		{
			f.initVal[k] = kval;
		}
	}
}

IG$/*mainapp*/.pp3 = function(f, sopt) {
	f.superclass = new IG$/*mainapp*/._I5c/*store*/();
	f.prototype = new IG$/*mainapp*/._I5c/*store*/();
	
	f.initVal = {};

	for (var k in sopt)
	{
		var kval = sopt[k],
			kt = typeof(kval);
		
			
		if (kt == "function")
		{
			f.prototype[k] = kval;
		}
		else
		{
			f.initVal[k] = kval;
		}
	}
}

IG$/*mainapp*/._I59/*DomMonitor*/ = function() {
	this.m/*monitor*/ = [];
	this.mit/*timer*/ = -1;
	this.minterval = 500;
	
	this.dM/*doMontioring*/();
}

IG$/*mainapp*/._I5a/*rowdata*/ = function(data, store) {
	this.store = store;
	this.data = data;
}

IG$/*mainapp*/._I5a/*rowdata*/.prototype = {
	get: function(fieldname) {
		return this.data[fieldname];
	},
	appendChild: function(data, bopen) {
		var me = this,
			i,
			ul = $("ul", this.rdiv),
			row,
			mdiv;
			
		if (ul.length == 0)
		{
			ul = $("<ul></ul>").appendTo(this.rdiv);
			
			if (!bopen)
			{
				ul.hide();
			}
		}
		
		$.each(data, function(i, dt) {
			row = new IG$/*mainapp*/._I5a/*rowdata*/(dt, me.store);
			mdiv = me.store.m1/*makeNodeDiv*/(dt, ul, row);
			
			if (dt.id)
			{
				me.store.rowmap[dt.id] = row;
			}
		});
	}
}

IG$/*mainapp*/._I5b/*models*/ = function(data, id) {
	this.id = id;
	this.data = data;
}

IG$/*mainapp*/._I5b/*models*/.prototype = {
	get: function(fname) {
		return this.data[fname];
	}
}

IG$/*mainapp*/._I5c/*store*/ = function(params, owner) {
	this.owner = owner;
	for (var k in params)
	{
		this[k] = params[k];
	}
	
	if (this.data)
	{
		this.initData = this.data;
	}
	
	this.data = {
		items: []
	};
	
	this.rowmap = {};
	
	this.gitems = [];
	
	if (this.initData)
	{
		this.loadData(this.initData);
	}
}

IG$/*mainapp*/._I5c/*store*/.prototype = {
	constructor: function(config) {
		if (this.root)
		{
			this.setRootNode(this.root);
		}
		
		if (this.reader)
		{
			this.reader.model = IG$/*mainapp*/._I5b/*models*/;
		}
	},
	
	clearData: function() {
	},
	
	loadData: function(arr) {
		this.rawData = arr;
		
		this.validateData();
	},
	
	remove: function(row) {
		
	},
	
	validateData: function() {
		var t = this,
			i,
			me = this.owner,
			arr = t.rawData,
			cmpp,
			displayField = me.displayField,
			valueField = me.valueField,
			groupField = t.groupField,
			tg,
			ddGroup = me.ddGroup;
			
		if (!ddGroup && me.viewConfig && me.viewConfig.plugins)
		{
			ddGroup = me.viewConfig.plugins.ddGroup;
		}
		
		switch (me.xtype)
		{
		case "combobox":
			cmpp = me.cmpp;
			cmpp.empty();
			
			for (i=0; i < arr.length; i++)
			{
				$("<option value='" + arr[i][valueField] + "'>" + arr[i][displayField] + "</option>").appendTo(cmpp);
			}
			break;
		case "grid":
			cmpp = me.cmpp;
			
			var tr;
			
			for (i=0; i < t.data.items.length; i++)
			{
				t.data.items[i].rdiv.empty();
				t.data.items[i].rdiv.remove();
			}
			
			for (i=0; i < t.gitems.length; i++)
			{
				t.gitems[i].rdiv.remove();
			}
			
			if (groupField)
			{
				arr.sort(function(a, b) {
					var ta = a[groupField],
						tb = b[groupField],
						r = 0;
					
					if (ta > tb)
					{
						r = 1;
					}
					else if (ta < tb)
					{
						r = -1;
					}
					return r;
				});
			}
			
			$.each(arr, function(i, row) {
				var dr;
				
				if (groupField)
				{
					var gname = row[groupField];
					
					if (gname != tg)
					{
						tr = $("<tr class='mec-el-group-row'></tr>").appendTo(cmpp);
						var gtd = $("<td colspan='" + me.columns.length + "'>" + gname + "</td>").appendTo(tr);
						
						t.gitems.push({
							rdiv: tr
						});
						tg = gname;
					}
				}
				
				if (t.data.items.length > i)
				{
					dr = t.data.items[i];
					dr.data = row;
					tr = dr.rdiv;
					tr.appendTo(cmpp);
				}
				else
				{
					dr = new IG$/*mainapp*/._I5a/*rowdata*/(row, this);
					tr = $("<tr></tr>").appendTo(cmpp);
					dr.rdiv = tr;
				
					t.data.items.push(dr);
				}
				
				$.each(me.columns, function(j, dt) {
					if (dt.hidden != true)
					{
						var td = $("<td><div class='mec-el-grid-text'>" + (row[dt.dataIndex] || "") + "</div></td>").appendTo(tr);
						
						if (dt.xtype == "actioncolumn")
						{
							$.each(dt.items, function(k, act) {
								var abtn = $("<div class='mec-el-grid-action-button'></div>").appendTo(td);
								abtn.css({backgroundImage: "url(" + act.icon + ")"});
								abtn.bind("click", function() {
									if (act.handler)
									{
										act.handler.call(act.scope || act, me, i, j);
									}
								});
							});
						}
						else
						{
							td.bind("click", function() {
								if (me.listeners && me.listeners.itemclick)
								{
									me.listeners.itemclick.call(me, me, dr, dr.data, i, {});
								}
							});
							
							if (dt.editor || dt.field)
							{
								td.bind("dblclick", function() {
									t.doEdit.call(t, dt, td, row);
								});
							}
							
							if (ddGroup)
							{
								var ditem = $(".mec-el-grid-text", td);
								ditem.draggable({
									delay: 100,
									appendTo: $(document.body),
									zIndex: 100,
									helper: "clone",
									start: function(event, ui) {
										window.IG$/*mainapp*/.jDnD/*dragging*/ = {
											owner: me,
											row: dr,
											column: dt
										};
									},
									stop: function(event, ui) {
										var dropping = window.IG$/*mainapp*/.jDrD/*dropping*/;
										
										if (dropping)
										{
											var me = dropping.owner,
												mdata = dropping.mdata,
												dropRec = dropping.dropRec;
											
											if (me.viewConfig.listeners && me.viewConfig.listeners.drop)
											{
												me.viewConfig.listeners.drop.call(me, {}, mdata, dropRec.data, dropRec.position);
											}
										}
									}
								});
							}
						}
					}
				});
			});
			break;
		}
	},
	
	endEdit: function() {
		var me = this,
			owner = me.owner,
			nval,
			column,
			td,
			inst = me.eInst,
			row;
			
		if (inst)
		{
			column = inst.column;
			td = inst.td;
			row = inst.row;
			
			nval = row[column.dataIndex];
			if (column.editor)
			{
				nval = owner.etxt.val();
				
				if (column.editor.allowBlank == false && !nval)
				{
					nval = row[column.dataIndex];
				}
			}
			else if (column.field)
			{
				nval = $("option:selected", column.field.ediv).val();
				
				if (column.field.allowBlank == false && !nval)
				{
					nval = row[column.dataIndex];
				}
			}
			
			row[column.dataIndex] = nval;
			td.text(nval);
		}
		
		owner.ediv.hide();
		
		me.eInst = null;
	},
	
	doEdit: function(column, td, row) {
		var me = this,
			owner = me.owner,
			cmpp = owner.cmpp,
			coff = cmpp.offset(),
			moff = td.offset(),
			tleft = moff.left - coff.left,
			ttop = moff.top - coff.top,
			editor,
			tw = td.outerWidth(),
			th = td.outerHeight(),
			i,
			cval = row[column.dataIndex],
			mc;
			
		me.endEdit();
		
		owner.ediv.empty();
		
		if (column.editor)
		{
			editor = owner.etxt;
			editor.val(cval);
			owner.etxt.appendTo(owner.ediv);
			
			editor.bind('keypress', function(e) {
				if (e.keyCode == 13)
				{
					me.endEdit.call(me);
					return false;
				}
			});
		}
		else if (column.field)
		{
			if (!column.field.ediv)
			{
				switch (column.field.xtype)
				{
				case "combobox":
					column.field.ediv = $("<select></select>");
					if (column.field.store && column.field.store.data)
					{
						for (i=0; i < column.field.store.data.length; i++)
						{
							$("<option value='" + (column.field.store.data[i].value || column.field.store.data[i].name) + "'>" + (column.field.store.data[i].name || "") + "</option>").appendTo(column.field.ediv);
						}
					}
					break;
				}
			}
			
			editor = column.field.ediv;
			
			if (column.field.xtype == "combobox")
			{
				editor.bind("change", function() {
					me.endEdit.call(me);
				});
			}
			
			var opts = $("option", editor);
			for (i=0; i < opts.length; i++)
			{
				mc = $(opts[i]);
				if (mc.val() == cval)
				{
					mc.attr("selected", true);
				}
				else
				{
					mc.removeAttr("selected");
				}
			}
			
			editor.appendTo(owner.ediv);
		}
		
		if (editor)
		{
			editor.width(tw).height(th);
		}
		
		owner.ediv.css({left: tleft, top: ttop, width: tw, height: th});
		owner.ediv.show();
		
		me.eInst = {
			column: column,
			td: td,
			row: row
		};
	},
	
	insert: function(pos, obj) {
		var me = this;
		me.rawData.splice(pos, 0, obj);
		
		me.validateData();
	},
	
	add: function(obj) {
		var me = this;
		me.rawData.push(obj);
		
		me.validateData();
	},
	
	remove: function(row) {
		var i,
			n = -1;
		for (i=0; i < this.data.items.length; i++)
		{
			if (this.data.items[i] == row)
			{
				n = i;
				break;
			}
		}
		
		if (n > -1)
		{
			this.rawData.splice(n, 1);
			this.validateData();
		}
	},
	
	getAt: function(row) {
		return this.data.items[row];
	},
	
	requestResult: function(row) {
		var me = this;
		
		$.ajax({
			url: ig$/*appoption*/.servlet,
			data: me.extraParams,
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
				var doc = response,
					records,
					items = [],
					i;
	        	doc = (doc == "") ? '<smsg errorcode="0xffff" errormsg="Server incorrect responding"/>': doc;
				records = me.reader.readRecords({
					responseText: doc
				});
				
				for (i=0; i < records.records.length; i++)
				{
					items.push(records.records[i].data);
				}
				row.appendChild(items, true);
				row.expanded = true;
				
			},
			error: function(xhr, status, err) {
	        	var doc = "<smsg errorcode='0x9999' errormsg='Server URL Connection Failed'/>",
	        		xdoc = IG$/*mainapp*/._I13/*loadXML*/(doc);
			}
		});
	},
	
	m1/*makeNodeDiv*/: function(value, unode, row) {
		var rdiv,
			dcont,
			dtree,
			dcheck,
			dtext,
			store = row.store,
			owner = store.owner,
			ddGroup = owner.ddGroup;
		
		rdiv = $("<li></li>").appendTo(unode);
		
		dcont = $("<div class='mec-el-tree-box'></div>").appendTo(rdiv);
		dtree = $("<div class='mec-el-tree-disclose'></div>").appendTo(dcont);
		dcheck = $("<div class='mec-el-tree-checkbox'><input type='checkbox'></input></div>").appendTo(dcont);
		dtext = $("<div class='mec-el-tree-text'>" + (value.text || value.name) + "</div>").appendTo(dcont);
		
		row.rdiv = rdiv;
		row.expanded = false;
		
		dtext.bind("click", function() {
			var store = row.store;
			
			if (store.owner.listeners && store.owner.listeners.itemclick)
			{
				store.owner.listeners.itemclick.call(store.owner, store.owner, row, row.data, 0, {
					target: {}
				});
			}
		});
		
		if (typeof(value.checked) != "undefined")
		{
			dcheck.show();
			$("input", dcheck).bind("click", function() {
				var store = row.store;
				value.checked = $(this).attr("checked") ? true : false;
				if (store.owner.listeners && store.owner.listeners.checkchange)
				{
					store.owner.listeners.checkchange.call(store.owner, row, value.checked);
				}
			});
		}
		
		if (ddGroup)
		{
			dtext.row = row;
			dtext.unode = unode;
			
			dtext.draggable({
				delay: 100,
				appendTo: $(document.body),
				zIndex: 100,
				helper: "clone",
				start: function(event, ui) {
					window.IG$/*mainapp*/.jDnD/*dragging*/ = {
						owner: owner,
						row: row,
						column: 0
					};
				}
			});
		}
		
		if (value.leaf == true)
		{
			dtree.addClass("mec-el-tree-leaf");
		}
		else
		{
			dtree.bind("click", function() {
				var store = row.store,
					ul = $("ul", rdiv);
				
				if (ul.length == 0)
				{
					if (store.listeners && store.listeners.beforeload)
					{
						store.listeners.beforeload.call(store, store, {
							node: row
						});
					}
					
					if (store.proxy)
					{
						store.proxy.requestResult(row);
					}
				}
				else
				{
					if (row.expanded == false)
					{
						$(ul[0]).show();
						row.expanded = true;
					}
					else
					{
						$(ul[0]).hide();
						row.expanded = false;
					}
				}
			});
		}
		
		return rdiv;
	},
	setRootNode: function(value) {
		var owner = this.owner,
			cmpp = owner.cmpp,
			rdiv;
			
		cmpp.empty();
		this.rowmap = {};
		
		value.root = true;
		this.rootnode = new IG$/*mainapp*/._I5a/*rowdata*/(value, this);
		rdiv = this.m1/*makeNodeDiv*/(value, cmpp, this.rootnode);
	},
	getRootNode: function() {
		return this.rootnode;
	},
	getNodeById: function(id) {
		return this.rowmap[id];
	},
	
	dragOver: function(t, l) {
		var me = this,
			owner = me.owner,
			cmp = owner.cmp,
			coff = cmp.offset(),
			i,
			oindex = -1,
			oitem,
			loff,
			lh, lw,
			mt = 0;
		
		owner.dhelper.hide();
		
		for (i=0; i < me.data.items.length; i++)
		{
			oitem = me.data.items[i];
			loff = oitem.rdiv.offset();
			lh = oitem.rdiv.outerHeight();
			lw = oitem.rdiv.outerWidth();
			
			if (loff.left < l && l < loff.left + lw &&
				loff.top < t && t < loff.top + lh)
			{
				oindex = i;
				
				if (loff.top < t && t < loff.top + lh / 2)
				{
					mt = loff.top;
				}
				else
				{
					mt = loff.top + lh;
				}
				
				owner.dhelper.show();
				owner.dhelper.css({top: mt - coff.top, left: loff.left - coff.left}).width(lw);
			}
		}
	},
	
	indexOf: function(rec) {
		var me = this,
			i,
			ind = -1;
			
		for (i=0; i < me.data.items.length; i++)
		{
			if (me.data.items[i] == rec)
			{
				ind = i;
				break;
			}
		}
		
		return ind;
	},
	
	dropRec: function (t, l) {
		var me = this,
			owner = me.owner,
			cmp = owner.cmp,
			coff = cmp.offset(),
			i,
			oindex = -1,
			oitem,
			loff,
			lh, lw,
			mt = 0,
			rec = {};
		
		for (i=0; i < me.data.items.length; i++)
		{
			oitem = me.data.items[i];
			loff = oitem.rdiv.offset();
			lh = oitem.rdiv.outerHeight();
			lw = oitem.rdiv.outerWidth();
			
			if (loff.left < l && l < loff.left + lw &&
				loff.top < t && t < loff.top + lh)
			{
				oindex = i;
				rec.index = i;
				rec.data = me.data.items[i];
				
				rec.position = "after";
				
				if (loff.top < t && t < loff.top + lh / 2)
				{
					rec.position = "before";
				}
				break;
			}
		}
		
		return rec;
	}
}

IG$/*mainapp*/._I5d/*layout*/ = function(owner) {
	this.owner = owner;
}

IG$/*mainapp*/._I5d/*layout*/.prototype = {
	setActiveItem: function(index) {
		this.owner.setActiveItem.call(this.owner, index);
	}
}

IG$/*mainapp*/._I59/*DomMonitor*/.prototype = {
	dM/*doMontioring*/: function() {
		var me = this;
		
		clearTimeout(me.mit/*timer*/);
		
		me.mit/*timer*/ = setTimeout(function() {
			me.ddM/*actionMontitoring*/.call(me);
		}, me.minterval);
	},
	
	ddM/*actionMontitoring*/: function() {
		var me = this;
		$.each(me.m/*monitor*/, function(i, item) {
			var pw = item.pw || -1,
				ph = item.ph || -1,
				cw = item.elem.width(),
				ch = item.elem.height();
				
			if (cw > 0 && ch > 0 && (cw != pw || ch != ph))
			{
				item.handler.call(item.scope, item, cw, ch);
				item.pw = cw;
				item.ph = ch;
			}
		});
		
		me.dM/*doMonitoring*/();
	},
	
	Rg/*registerDom*/: function(elem, handler, scope) {
		var item = {
			elem: elem,
			handler: handler,
			scope: scope || elem[0]
		};
		
		this.m/*monitor*/.push(item);
		
		this.dM/*doMontioring*/();
	}
}

IG$/*mainapp*/._I5e/*DomMonitorInstance*/ = new IG$/*mainapp*/._I59/*DomMonitor*/();

IG$/*mainapp*/.superclass = function() {
}

IG$/*mainapp*/.superclass.prototype = {
	addEvents: function() {
		var me = this,
			args = arguments,
			i;
		for (i=0; i < args.length; i++)
		{
			me.cEv/*customEvents*/[args[i]] = 1;
		}
	},
	
	getLayout: function() {
		var me = this;
		
		me.__l1 = me.__l1 || new IG$/*mainapp*/._I5d/*layout*/(me);
		
		return me.__l1;
	},
	
	getGroupValue: function() {
		var me = this,
			p = me,
			r;
		
		r = $("input:checked", p.body).val() || "";
		
		return r;
	},
	
	getValue: function() {
		var me = this,
			r,
			cmpp;
		
		switch(me.xtype)
		{
		case "combobox":
			cmpp = me.cmpp;
			r = $("option:selected", cmpp).val();
			break;
		case "textarea":
			cmpp = me.cmpp;
			r = cmpp.val();
			break;
		case "checkbox":
			cmpp = $("input", me.cmpp);
			r = cmpp.attr("checked") ? true : false;
			break;
		case "textfield":
		case "numberfield":
			cmpp = me.cmpp;
			r = cmpp.val();
			break;
		}
		
		return r;
	},
	
	setValue: function(value) {
		var me = this,
			cmpp = me.cmpp,
			c, mc
			i;
			
		switch (me.xtype)
		{
		case "textarea":
			cmpp.val(value || "");
			break;
		case "textfield":
		case "numberfield":
			cmpp.val(value || "");
			break;
		case "checkbox":
			cmpp = $("input", me.cmpp);
			cmpp.attr("checked", value ? "checked" : null);
			break;
		case "combobox":
			c = $("option", cmpp);
			for (i=0; i < c.length; i++)
			{
				mc = $(c[i]);
				mc.attr("selected", (value == mc.val()));
			}
			break;
		}
	},
	
	setActiveItem: function(index) {
		var me = this,
			darr = this.darr,
			i, n = 0;
		
		for (i=0; i < darr.length; i++)
		{
			if (!darr[i].isTbar && !darr[i].isBbar)
			{
				darr[i].el[index == n ? "show" : "hide"]();
				n++;
			}
		}
		
		me.viewIndex = index;
		me.doLayout();
	},
	
	createComponent: function() {
		var me = this,
			carea,
			barea,
			region,
			cbox,
			body,
			i;
		
		me.cEv/*customEvents*/ = {};
		
		if (me.renderTo)
		{
			region = $(me.renderTo);
		}
		else
		{
			region = $(document.body);
		}
		
		me.el = $("<div class='mec-el' name='" + (me.name || "noname") + "'></div>").appendTo(region);
		IG$/*mainapp*/.ppP(me.el);
		me.el.dom = me.el[0];
		
		me.titlediv = $("<div class='mec-el-tt'></div>").appendTo(me.el).hide();
		
		body = me.body = $("<div id='mec_el_bd' class='mec-el-bd'></div>").appendTo(me.el);
		me.body.dom = me.body[0];
		IG$/*mainapp*/.ppP(body);
		
		me.bbardiv = $("<div class='mec-el-bbar'></div>").appendTo(me.el).hide();
		
		barea = $("<div class='qi-loading'></div>").appendTo(me.el);
		$("<div class='qi-loading-mask'></div>").appendTo(barea);
		cbox = $("<div class='qi-loading-box'><div class='qi-loading-text'>Loading Report<br>Please wait a second...</div><button class='qi-loading-btn'>Cancel</button></div>").appendTo(barea);
		
		me.barea = barea.hide();
		
		me.dmap = {};
		me.cmap = {};
		me.darr = [];
		me.cid = 0;
		
		var tb,
			tr,
			fitem;
			
		switch (me.xtype)
		{
		case "window":
			me.el.addClass("mec-el-window");
			break;
		case "combobox":
			tb = $("<table class='mec-field-container'></table>").appendTo(body);
			tr = $("<tr></tr>").appendTo(tb);
			$("<td><span class='mec-field-label'>" + (me.fieldLabel || "") + "</span></td>").appendTo(tr).width(me.fieldLabel ? 120 : "auto");
			fitem = $("<td class='mec-field-item' style='width:100%'></td>").appendTo(tr);
			me.cmpp = $("<select class='mec-field-combobox'></select>").appendTo(fitem);
			break;
		case "button":
			me.cmpp = $("<button class='mec-el-button'>" + me.text + "</button>").appendTo(body);
			me.cmpp.bind("click", function() {
				me.handler && me.handler.call(me.scope || me);
			});
			break;
		case "textarea":
			tb = $("<table class='mec-field-container'></table>").appendTo(body);
			tr = $("<tr></tr>").appendTo(tb);
			$("<td><span class='mec-field-label'>" + (me.fieldLabel || "") + "</span></td>").appendTo(tr).width(me.fieldLabel ? 120 : "auto");
			fitem = $("<td class='mec-field-item' style='width:100%'></td>").appendTo(tr);
			me.cmpp = $("<textarea class='mec-el-textarea'></textarea>").appendTo(fitem);
			break;
		case "textfield":
		case "numberfield":
			tb = $("<table class='mec-field-container'></table>").appendTo(body);
			tr = $("<tr></tr>").appendTo(tb);
			$("<td><span class='mec-field-label'>" + (me.fieldLabel || "") + "</span></td>").appendTo(tr).width(me.fieldLabel ? 120 : "auto");
			fitem = $("<td class='mec-field-item' style='width:100%'></td>").appendTo(tr);
			me.cmpp = $("<input type='text' class='mec-el-textfield'></input>").appendTo(fitem);
			break;
		case "radiogroup":
			tb = $("<table class='mec-field-container'></table>").appendTo(body);
			tr = $("<tr></tr>").appendTo(tb);
			$("<td><span class='mec-field-label'>" + (me.fieldLabel || "") + "</span></td>").appendTo(tr).width(me.fieldLabel ? 120 : "auto");
			me.cmpp = $("<td class='mec-field-item' style='width:100%'></td>").appendTo(tr);
			break;
		case "checkbox":
			tb = $("<table class='mec-field-container'></table>").appendTo(body);
			tr = $("<tr></tr>").appendTo(tb);
			$("<td><span class='mec-field-label'>" + (me.fieldLabel || "") + "</span></td>").appendTo(tr).width(me.fieldLabel ? 120 : "auto");
			
			fitem = $("<td class='mec-field-item' style='width:100%'></td>").appendTo(tr);
			me.cmpp = $("<label><input type='checkbox'></input>" + (me.boxLabel || "") + "</label>").appendTo(fitem);
			break;
		case "tabpanel":
			me.cmpp = $("<div class='mec-el-tabbar'><ul class='mec-ui-tabs-nav'></ul></div>").appendTo(body);
			break;
		case "fieldcontainer":
			tb = $("<table class='mec-field-container'></table>").appendTo(body);
			tr = $("<tr></tr>").appendTo(tb);
			if (me.fieldLabel)
			{
				$("<td><span class='mec-field-label'>" + (me.fieldLabel || "") + "</span></td>").appendTo(tr).width(me.fieldLabel ? 120 : "auto");
			}
			me.cmpp = $("<td class='mec-field-item' style='width:100%'></td>").appendTo(tr);
			break;
		case "grid":
			var th,
				cmp = $("<div class='mec-el-grid-container'></div>").appendTo(body);
			me.cmpp = $("<table class='mec-el-grid'></table>").appendTo(cmp);
			me.ediv = $("<div class='mec-el-grid-editor'></div>").appendTo(cmp).hide();
			me.etxt = $("<input type='text' class='mec-el-grid-texteditor'></div>");
			
			me.cmp = cmp;
			
			if (me.hideHeaders != true)
			{
				th = $("<tr></tr>").appendTo(me.cmpp);
				
				for (i=0; i < me.columns.length; i++)
				{
					if (me.columns[i].hidden != true)
					{
						me.columns[i].hdiv = $("<th>" + (me.columns[i].header || me.columns[i].text || "") + "</th>").appendTo(th);
					}
				}
			}
			
			if (me.viewConfig && me.viewConfig.plugins && me.viewConfig.plugins.ptype == "gridviewdragdrop")
			{
				me.dhelper = $("<div class='mec-el-datagrid-helper'></div>").appendTo(cmp);
				
				var fmouse = function(event) {
					var t = event.pageY,
						l = event.pageX;
					me.store.dragOver.call(me.store, t, l);
				};
				
				me.panel = me;
				
				cmp.droppable({
					over: function(event, ui) {
						// cmp.bind("mousemove", fmouse);
					},
					out: function(event, ui) {
						// cmp.unbind("mousemove", fmouse);
					},
					drop: function(event, ui) {
						cmp.unbind("mousemove", fmouse);
						var dnd = window.IG$/*mainapp*/.jDnD/*dragging*/;
						
						var t = event.pageY,
							l = event.pageX;
						
						var dropRec = me.store.dropRec.call(me.store, t, l);
						
						if (dnd)
						{
							var mdata = {
								view: dnd.owner,
								records: [
									dnd.row
								]
							};
							if (me.viewConfig.listeners && me.viewConfig.listeners.beforedrop)
							{
								var r = me.viewConfig.listeners.beforedrop.call(me, {}, mdata, dropRec.data, dropRec.position, {});
										
								if (r == false)
									return;
							}
							
							window.IG$/*mainapp*/.jDrD/*dropping*/ = {
								owner: me,
								mdata: mdata,
								dropRec: dropRec
							};
						}
					}
				});
			}
			break;
		case "displayfield":
			me.cmpp = $("<span>" + (me.value || "") + "</span>").appendTo(body);
			break;
		case "treepanel":
			var th,
				cmp = $("<div class='mec-el-grid-container'></div>").appendTo(body);
			me.cmpp = $("<ul style='float: left;'></ul>").appendTo(cmp);
			break;
		}
		
		if (me.initComponent)
		{
			me.initComponent();
		}
		
		if (me.xtype == "tabpanel")
		{
			var ul = $("ul", me.cmpp);
			ul.empty();
			
			$.each(me.items, function(i, item) {
				var btn = $("<li class='mec-pg-tab-button'><div class='btn_text'>" + (item.title) + "</div></li>").appendTo(ul);
				
				btn.bind("click", function() {
					var i=0;
					for (i=0; i < me.darr.length; i++)
					{
						me.darr[i].el[(me.items[i] == item) ? "show" : "hide"]();
					}
					
					me.doLayout();
				});
			});
		}
		else if (me.xtype == "radiogroup")
		{
			me.cmpp.empty();
			for (i=0; i < me.items.length; i++)
			{
				var lbutton = $("<label><input type='radio' class='mec-el-radio-button' name='" + (me.items[i].name || "") + "' value='" + (me.items[i].inputValue) + "'></input>" + (me.items[i].boxLabel || "") + "</span>").appendTo(me.cmpp);
				
				if (me.items[i].checked)
				{
					$("input", lbutton).attr("checked", "checked");
				}
				
				me.cmap[me.items[i].name] = me;
			}
		}
		else if (me.xtype == "checkbox")
		{
			var inp = $("input", me.cmpp);
			
			inp.bind("click", function() {
				var checked = $(this).attr("checked") ? true : false;
				
				if (me.listeners && me.listeners.change)
				{
					me.listeners.change.call(me.listeners.scope || me, me, checked, !checked, {});
				}
			});
		}
		
		if (me.xtype == "treepanel" && !me.store)
		{
			me.store = {};
		}
		
		if (me.store)
		{
			me.store = new IG$/*mainapp*/._I5c/*store*/(me.store, me);
		}
		
		var padding = 0;
		
		if (me.bodyPadding)
		{
			padding = me.bodyPadding;
		}
		else if (me.padding)
		{
			padding = me.padding;
		}
		
		if (padding > 0)
		{
			me.body.css("padding", padding);
		}
		
		if (me.bodyStyle)
		{
			var bstyle = me.bodyStyle.split(";"),
				styleobj = {},
				t;
			for (i=0; i < bstyle.length; i++)
			{
				t = bstyle[i].split(":");
				if (t.length == 2)
				{
					styleobj[t[0]] = t[1];
				}
			}
			me.body.css(styleobj);
		}
		
		me._mcomp = true;
	},
	
	show: function() {
		var me = this,
			body = $(document.body),
			tw = body.width(),
			th = body.height(),
			modal = me.modal;
		
		if (modal)
		{
			if (!IG$/*mainapp*/._IA6/*modalBackgraound*/)
			{
				IG$/*mainapp*/._IA6/*modalBackgraound*/ = $("<div class='mec-el-modal-bg'></div>").appendTo(body);
				IG$/*mainapp*/._IA6/*modalBackgraound*/.modalcnt = 0;
			}
			
			IG$/*mainapp*/._IA6/*modalBackgraound*/.modalcnt ++;
			
			IG$/*mainapp*/._IA6/*modalBackgraound*/.show();
			me.el.appendTo(body);
			me.el.css({zIndex: 80});
		}
		
		me.setSize(me.width, me.height);
		me.setPosition((tw - me.width) / 2, (th - me.height) / 2);
		
		if (this.listeners)
		{
			if (this.xtype == "window" && this.listeners.afterrender)
			{
				var ev = this.listeners.afterrender;
				ev.call(me.listeners.scope || me, me);
			}
		}
		
		me.doLayout();
	},
	
	close: function() {
		var me = this,
			modal = me.modal;
		
		if (modal && IG$/*mainapp*/._IA6/*modalBackgraound*/)
		{
			IG$/*mainapp*/._IA6/*modalBackgraound*/.modalcnt --;
			
			if (IG$/*mainapp*/._IA6/*modalBackgraound*/.modalcnt == 0)
			{
				IG$/*mainapp*/._IA6/*modalBackgraound*/.hide();
			}
		}
		
		me.el.remove();
	},
	
	down: function(dname) {
		var me = this,
			r = null,
			dval;
		
		if (dname.charAt(0) == "[" && dname.charAt(dname.length-1) == "]")
		{
			dname = dname.substring(1, dname.length-1);
			dval = dname.split("=");
			if (dval && dval.length > 1)
			{
				r = me.findComponent(dval[1]);
			}
		}
		
		return r;
	},
	
	fireEvent: function() {
		var i,
			args = [],
			eventname,
			p,
			c;
		
		for (i=0; i < arguments.length; i++)
		{
			if (i == 0)
			{
				eventname = arguments[0];
			}
			else if (i > 1)
			{
				args.push(arguments[i]);
			}
		}
		// this.parent && this.parent.body.trigger(eventname, args);
		c = this;
		p = this.parent;
		while (p)
		{
			if (p.listeners && p.listeners[eventname])
			{
				args.splice(0, 0, p);
				p.listeners[eventname].apply(p, args);
				break;
			}
			
			c = p;
			p = p.parent;
		}
		/*
		if (args.length == 0)
		{
			this.body.trigger(eventname);
		}
		else if (args.length == 1)
		{
			this.body.trigger(eventname, args[0]);
		}
		else if (args.length == 2)
		{
			this.body.trigger(eventname, args[0], args[1]);
		}
		else if (args.length == 3)
		{
			this.body.trigger(eventname, args[0], args[1], args[2]);
		}
		else if (args.length == 4)
		{
			this.body.trigger(eventname, args[0], args[1], args[2], args[3]);
		}
		*/
	},
	
	findComponent: function(dname) {
		var me = this,
			r = null;
		
		r = me.dmap[dname];
		
		if (!r)
		{
			r = me.cmap[dname];
		}
		
		if (!r)
		{
			for (var k in me.dmap)
			{
				r = me.dmap[k].findComponent(dname);
				
				if (r)
				{
					break;
				}
			}
		}
		
		return r;
	},
	
	clearSize: function(item) {
		var me = item || this,
			darr = me.darr,
			i,
			forcerefresh = false;
			
		if (me.parent.layout.type == "hbox")
		{
			forcerefresh = true;
		}
		
		if (forcerefresh != true && (me.flex || me.height))
		{
		}
		else if (me.layout && me.layout.type == "absolute")
		{
			// do nothing
		}
		else
		{
			me.titlediv.css("width", "auto");
			me.titlediv.css("height", "auto");
			me.body.css("width", "auto");
			me.body.css("height", "auto");
			me.el.css("width", "auto");
			me.el.css("height", "auto");
			
			for (i=0; i < darr.length; i++)
			{
				darr[i].clearSize(darr[i]);
			}
			
			switch (me.xtype)
			{
			case "textarea":
				// w > 0 && me.cmpp.width(w);
				// bh > 0 && me.cmpp.height(bh);
				me.cmpp.css("height", "auto");
				break;
			}
		}
	},
	
	setSize: function(w, h) {
		var me = this,
			body = $(me.body),
			el = me.el,
			titlediv = me.titlediv,
			bbardiv = me.bbardiv,
			by = 0,
			bh = h;
					
		me.__ph = h;
		me.__pw = w;
			
		if (isNaN(w) == false && w > 0)
		{
			el.width(w);
		}
		if (isNaN(h) == false && h > 0)
		{
			el.height(h);
		}
		
		titlediv.width(w);
		
		if (me.title && me.xtype != "fieldset")
		{
			by = titlediv.outerHeight()
			bh = h - by; 
		}
		
		if ((me.buttons && me.buttons.length > 0) || (me.bbar && me.bbar.length > 0))
		{
			bh -= bbardiv.outerHeight();
		}
		
		if (me.xtype == "tabpanel")
		{
			// bh -= me.cmpp.outerHeight();
		}
		
		if (isNaN(w) == false && w > 0)
		{
			body.width(w);
		}
		
		if (isNaN(bh) == false && bh > 0)
		{
			body.height(bh);
		}
		
		switch (me.xtype)
		{
		case "textarea":
			// w > 0 && me.cmpp.width(w);
			// bh > 0 && me.cmpp.height(bh);
			bh > 0 && me.cmpp.height(bh);
			break;
		}
		
		me.doLayout();
	},
	
	setPosition: function(x, y) {
		var me = this,
			el = me.el;
			
		el.css({top: y, left: x});
		
		if (me.parent && me.parent.layout.type == "absolute")
		{
			var mw = Math.max(me.parent.el.width(), x + me.el.width()),
				mh = Math.max(me.parent.el.height(), y + me.el.height());
				
			me.parent.el.width(mw);
			me.parent.el.height(mh);
		}
	},
	
	setLoading: function(visible) {
		var me = this;
		
		if (me.barea)
		{
			clearTimeout(me.ltimer);
			
			if (visible == false)
			{
				me.ltimer = setTimeout(function() {
					me.barea.fadeOut();
				}, 100);
			}
			else
			{
				me.barea.show();
			}
		}
	},
	
	setVisible: function(visible) {
		this.hidden = !visible;
		this.el[visible ? "show" : "hide"]();
		
		this.parent && this.parent.doLayout(this.parent);
	},
	
	getWidth: function() {
		return this.body.width();
	},
	
	getHeight: function() {
		return this.body.height();
	},
	
	setAutoScroll: function(value) {
		this.autoScroll = value;
		if (this.autoScroll)
		{
			this.body.css({overflowX: "hidden", overflowY: "auto"});
		}
		else
		{
			this.body.css({overflowX: "hidden", overflowY: "hidden"});
		}
		this.doLayout();
	},
	
	add: function(container) {
		var me = this;
			
		if (container)
		{
			container.parent = this;
			if (container.isBbar == true)
			{
				container.el.appendTo(this.bbardiv);
			}
			else if (this.xtype == "fieldcontainer")
			{
				container.el.appendTo(this.cmpp);
			}
			else
			{
				container.el.appendTo(this.body);
			}
			container.name = container.name || ("cid_" + (this.cid++));
			this.dmap[container.name] = container;
			this.darr.push(container);
			
			this.doLayout();
		}
	},
	
	setTitle: function(value) {
		var me = this;
		
		me.title = value;
		
		me.titlediv.html(value);
		me.titlediv[me.title && me.xtype != "fieldset" ? "show" : "hide"]();
		
		me.doLayout();
	},
	
	removeAll: function() {
		this.body.empty();
		this.dmap = {};
		this.darr = [];
		
		this.doLayout();
	},
	
	buildItems: function() {
		var me = this;
		if (me.tbar)
		{
			$.each(me.tbar, function(i, item) {
				if (!item)
					return;
				
				item.isTbar = true;
				
				if (item._mcomp)
				{
					me.add(item);
				}
				else
				{
					var spanel = new mecP(item, me.defaults || {});
					me.add(spanel);
				}
			});
		}
		
		if (me.bbar)
		{
			$.each(me.bbar, function(i, item) {
				if (!item)
					return;
				
				item.isBbar = true;
				
				if (item._mcomp)
				{
					me.add(item);
				}
				else
				{
					var spanel = new mecP(item, me.defaults || {});
					me.add(spanel);
				}
			});
		}
		
		if (me.items && me.xtype != "radiogroup")
		{
			$.each(me.items, function(i, item) {
				if (!item)
					return;
				
				if (item._mcomp)
				{
					me.add(item);
				}
				else
				{
					var spanel = new mecP(item, me.defaults || {});
					me.add(spanel);
				}
			});
		}
	},
	
	initComponent: function() {
		var me = this;
		
		me.buildItems();
		
		me.doLayout();
		
		IG$/*mainapp*/._I5e/*DomMonitorInstance*/.Rg/*registerDom*/(me.el, function() {
			me.doLayout.call(me);
			
			if (me.listeners && me.listeners.resize)
			{
				setTimeout(function() {
					var ev = me.listeners.resize,
						w = me.el.width(),
						h = me.el.height();
					
					
					ev.call(ev.scope || me, me, w, h);
				}, 10);
			}
		});
		
		if (me.html)
		{
			me.body.html(me.html);
		}
		
		if (me.hidden == true)
		{
			me.setVisible(false);
		}
		
		if (me.title && me.xtype != "container")
		{
			me.setTitle(me.title);
		}
		
		if ((me.buttons && me.buttons.length > 0) || (me.bbar && me.bbar.length > 0))
		{
			me.bbardiv.show();
			var bright = false,
				dleft = $("<div class='mec-el-button-left'></div>").appendTo(me.bbardiv),
				dright = $("<div class='mec-el-button-right'></div>").appendTo(me.bbardiv);
			
			if (me.buttons)
			{				
				$.each(me.buttons, function(i, btn) {
					if (btn == "->")
					{
						bright = true;
					}
					else
					{
						var btndiv = $("<button class='mec-el-button'>" + btn.text + "</button>").appendTo(bright == true ? dright : dleft);
						btndiv.bind("click", function() {
							btn.handler && btn.handler.call(btn.scope || me);
						});
					}
				});
			}
		}
		
		if (this.listeners)
		{
			if (this.xtype != "window" && this.listeners.afterrender)
			{
				var ev = this.listeners.afterrender;
				ev.call(me.listeners.scope || me, me);
			}
			
			/*
			$.each(this.listeners, function(k, ev) {
				switch (k)
				{
				case "afterrender":
					
					break;
				case "resize":
					break;
				default:
					if (me.cEv[k])
					{
						me.cEv[k] = ev;
						me.body.bind(k, function() {
							var i,
								args = [me],
								e1 = arguments.length > 0 ? arguments[0] : null,
								st = (e1 && e1.currentTarget ? 2 : 0),
								lname = me.name;
							
							if (e1 && e1.stopImmediatePropagation)
							{
								if (e1.isImmediatePropagationStopped())
									return;
									
								e1.stopImmediatePropagation();
								e1.stopPropagation();
							}
							
							for (i=st; i < arguments.length; i++)
							{
								args.push(arguments[i]);
							}
														
							ev.apply(me.listeners.scope || me, args);
							
							return false;
						}, true);
					}
					break;
				}
			});
			*/
		}
	},
	
	doLayout: function() {
		var me = this;
		if (me.dltimer)
		{
			clearTimeout(me.dltimer);
		}
		
		me.dltimer = setTimeout(function() {
			me.doComponentLayout.call(me);
		}, 20);
	},
	
	doComponentLayout: function() {
		var me = this;
		me.layout = me.layout || {};
		
		var darr = me.darr,
			ltype = me.layout,
			lt = typeof(ltype),
			w = me.body.width(),
			h = me.body.height(),
			i, border = {},
			tw=0, th=0, fw=0, fh=0, mx=0, my=0, mw, mh,
			sx=0, sy=0,
			n, ty = 0,
			by = 0;
		
		if (lt == "string")
		{
			me.layout = {
				type: me.layout
			}
		}
				
		if (!w || !h)
			return;
			
		for (i=0; i < darr.length; i++)
		{
			if (darr[i].isTbar == true)
			{
				darr[i].setSize(w, 0);
				ty = Math.max(ty, darr[i].getHeight());
			}
			else if (darr[i].isBbar == true)
			{
				darr[i].setSize(w, 0);
				//by = Math.max(by, darr[i].getHeight());
			}
		}
		
		if (me.xtype == "tabpanel")
		{
			h = h - me.cmpp.outerHeight();
		}
		
		h = h - ty - by;
				
		switch (me.layout.type)
		{
		case "fit":
			for (i=0; i < darr.length; i++)
			{
				!darr[i].isTbar && !darr[i].isBbar && darr[i].setSize(w, h);
				!darr[i].isTbar && !darr[i].isBbar && darr[i].setPosition(0, ty);
			}
			break;
		case "absolute":
			for (i=0; i < darr.length; i++)
			{
				darr[i].el.css({position: "absolute"});
			}
			break;
		case "border":
			for (i=0; i < darr.length; i++)
			{
				if (darr[i].isTbar || darr[i].isBbar)
					continue;
				
				darr[i].clearSize();
				border[darr[i].region] = darr[i];
				
				switch (darr[i].region)
				{
				case "north":
					!darr[i].hidden && darr[i].height ? th += darr[i].height : fh += darr[i].flex;
					break;
				case "south":
					!darr[i].hidden && darr[i].height ? th += darr[i].height : fh += darr[i].flex;
					break;
				case "west":
					!darr[i].hidden && darr[i].width ? tw += darr[i].width : fw += darr[i].flex;
					break;
				case "east":
					!darr[i].hidden && darr[i].width ? tw += darr[i].width : fw += darr[i].flex;
					break;
				case "center":
					!darr[i].hidden && darr[i].height ? th += darr[i].height : fh += darr[i].flex;
					!darr[i].hidden && darr[i].width ? tw += darr[i].width : tw += darr[i].flex;
					break; 
				}
			}
			
			mh = 0;
			if (border.north && !border.north.hidden)
			{
				border.north._height = border.north.height || (h - th) * border.north.flex / fh;
				border.north.setSize(w, border.north._height);
				my += border["north"]._height;
				border.north.setPosition(0, 0);
				mh += border.north._heigth;
			}
			if (border.south && !border.south.hidden)
			{
				border.south._height = border.south.height || (h - th) * border.south.flex / fh;
				border.south.setSize(w, border.south._height);
				mh += border.south._heigth;
				border.south.setPosition(0, th - border.south._height);
			}
			mw = 0;
			if (border.west && !border.west.hidden)
			{
				border.west._width = border.west.width || (w - tw) * border.west.flex / fw;
				border.west.setSize(border.west._width, th - mh);
				mx += border.west._width;
				border.west.setPosition(0, my);
				mw += border.west._width;
			}
			if (border.east && !border.east.hidden)
			{
				border.east._width = border.east.width || (w - tw) * border.east.flex / fw;
				border.east.setSize(border.east._width, th - mh);
				mw += border.east._width;
				border.east.setPosition(tw - border.east._width, my);
			}
			if (border.center)
			{
				border.center.setSize(w - mw, h - mh);
				border.center.setPosition(mx, my);
			}
			
			break;
		case "vbox":
			for (i=0; i < darr.length; i++)
			{
				if (!darr[i].isTbar && !darr[i].isBbar && darr[i].hidden != true)
				{
					darr[i].clearSize();
					if (darr[i].height)
					{
						th += darr[i].height;
					}
					else if (darr[i].flex)
					{
						fh += darr[i].flex;
					}
					else
					{
						th += darr[i].getHeight();
						
						if (th == 95)
						{
							console.log(">>");
						}
					}
				}
			}
			
			for (i=0; i < darr.length; i++)
			{
				if (!darr[i].isTbar && !darr[i].isBbar && darr[i].hidden != true)
				{
					mw = w; // darr[i].width ? darr[i].width : (w - tw) * darr[i].flex / fw;
		
					if (darr[i].height)
					{
						mh = darr[i].height;
						sy = mh;
					}
					else if (darr[i].flex)
					{
						mh = (h - th) * darr[i].flex / fh;
						sy = mh;
					}
					else
					{
						mh = 0;
						sy = darr[i].getHeight();
					}
					
					darr[i].setSize(mw, mh);
					// darr[i].setPosition(0, my);
					my += sy;
				}
			}
			break;
		case "hbox":
			for (i=0; i < darr.length; i++)
			{
				if (!darr[i].isTbar && !darr[i].isBbar && darr[i].hidden != true)
				{
					darr[i].clearSize(null, true);
					
					if (darr[i].width)
					{
						tw += darr[i].width;
					}
					else if (darr[i].flex)
					{
						fw += darr[i].flex;
					}
					else
					{
						tw += darr[i].getWidth();
					}
				}
			}
			
			for (i=0; i < darr.length; i++)
			{
				if (!darr[i].isTbar && !darr[i].isBbar && darr[i].hidden != true)
				{
					darr[i].el.addClass("mec-el-hbox");
					mh = h; // darr[i].width ? darr[i].width : (w - tw) * darr[i].flex / fw;
					if (darr[i].width)
					{
						mw = darr[i].width;
						sx = mw;
					}
					else if (darr[i].flex)
					{
						mw = (w - tw) * darr[i].flex / fw;
						sx = mw;
					}
					else
					{
						mw = 0;
						sx = darr[i].getWidth();
					}
					
					darr[i].setSize(mw, mh);
					// darr[i].setPosition(mx, 0);
					mx += sx;
				}
			}
			break;
		case "card":
			me.viewIndex = typeof(me.viewIndex) == "undefined" ? 0 : me.viewIndex;
			n = 0;
			for (i=0; i < darr.length; i++)
			{
				if (darr[i].isTbar || darr[i].isBbar)
					continue;
					
				darr[i].setSize(w, h);
				// darr[i].setPosition(0, ty);
				darr[i].el[(n == me.viewIndex) ? "show" : "hide"]();
				n++;
			}
			break;
		default:
			break;
		}
	}
};

IG$/*mainapp*/.define = function(dname, sopt) {
	var cf;
	
	cf = function(opt) {
		var me = this,
			dval = (dname ? window[dname].initVal : null),
			va;
		
		for (var k in dval)
		{
			va = dval[k];
			me[k] = va;
		}
		
		if (opt)
		{
			for (var k in opt)
			{
				va = opt[k];
				me[k] = va;
			}
		}
		
		if (me.xtype == "store" || me.xtype == "proxy")
		{
			me.constructor && me.constructor.call(me, opt);
		}
		else
		{
			me.createComponent();
		}
	};
	
	if (dname)
	{
		window[dname] = cf;
	}
	
	if (sopt.xtype == "store" || sopt.xtype == "proxy")
	{
		IG$/*mainapp*/.pp3((dname ? window[dname] : cf), sopt);
	}
	else
	{
		IG$/*mainapp*/.pp2((dname ? window[dname] : cf), sopt);
	}
	
	return cf;
}

IG$/*mainapp*/.define("mecP", {});
IG$/*mainapp*/.define("mecC", {});

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


