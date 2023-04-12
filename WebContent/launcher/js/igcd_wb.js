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

webix.DataDriver.ildr = {
	//convert xml string to xml object if necessary
	toObject: function(data){
		return data;
	},
	//get array of records
	getRecords:function(data){
		return data;
	},
	//get hash of properties for single record
	getDetails:function(data){
		return data.data;
	},
	getOptions:function(){ 
		return false;
	},
	//get count of data and position at which new data_loading need to be inserted
	getInfo:function(data){
		return {
			size:0,
			from:0
		};
	},
	
	child: function(obj){
		var parse_name = "children",
			t = obj[parse_name];
		// if (t)
		//	delete obj[parse_name];
		return t;
	}
}

var $s ={};

$s.__hh = 28;

$s.ready = function(d) {
	webix.ready(d);
};

$s.getBlank = function(hidden) {
	var r = 
		{
			view: "layout",
			autowidth: true,
			autoheight: true,
			adjust: true,
			_mblank: 1,
            borderless: true,
			hidden: hidden,
			rows: [
				{
					borderless: true,
					padding: 0,
					template: ""
				}
			]
		};
	
	return r;
}

$s.getEvent = function(ev) {
	var r = new $s.event(ev);
	return r;
}

$s.event = function(ev) {
	this.browserEvent = ev;
	
	if (ev && typeof(ev.x) != "undefined" && typeof(ev.y) != "undefined")
	{
		this.xy = [ev.x, ev.y];
	}
}

$s.event.prototype = {
	getX: function() {
		return this.browserEvent.pageX;
	},
	getY: function() {
		return this.browserEvent.pageY;
	}
}

$s.extend = IG$/*mainapp*/.x_c/*extend*/;
$s.apply = IG$/*mainapp*/.apply;

$s.body = function(c, is_el) {
	var me = this;
	me._c = c;
	me.dom = null;
	me.is_el = is_el;
}

$s.body.prototype = {
	updateDom: function() {
		var me = this,
			dx = me._c.$dx,
			ex = me._c.$ex;
		
		if (me.is_el && ex)
		{
			me.dom = dx.$view;
		}
		else if (dx)
		{
			me.dom = dx.$view;
		}
	}
}

$s.object = function(config) {
	// this.constructor.apply(this, arguments);
	this.base_constructor.apply(this, arguments);
	return this;
}

$s.object.prototype = {
	__mbase: 1,
		
	base_constructor: function() {
		var me = this,
			args = Array.prototype.slice.call(arguments),
			config;
			
		if (me.xtype == "dropzone" && args.length > 1 && args[0])
		{
			var el = args[0];
			args.splice(0, 1);
			args[0].targetEl = el;
			config = args[0];
		}
		else
		{
			config = args[0];
		}
			
		config = config || {};
		
		IG$/*mainapp*/.apply(me, config);
		
		me._iconfig = config;
		
		me.initComponent.apply(me, args);
	},
	
	initComponent: function() {
		var me = this,
			listeners = me.listeners;
			
		me._listeners = me._listeners || {};
		
		if (listeners)
		{
			$.each(listeners, function(ev, listener) {
				me.on.call(me, ev, listener, listeners.scope);
			});
		}
	},
	
	on: function(ename, f, scope) {
		var me = this,
			_listeners,
			l;
		
		me._listeners = (me._listeners || {})
		_listeners = me._listeners;
		
		l = _listeners[ename] = _listeners[ename] || [];
		
		l.push({
			f: f,
			scope: scope || me
		});
	},
	
	un: function(ename) {
		var me = this,
			_listeners,
			l;
		
		me._listeners = (me._listeners || {})
		_listeners = me._listeners;
		
		_listeners[ename] = [];
		
		
	},
	
	chlidProcessEvents: function() {
		var me = this,
			args = Array.prototype.slice.call(arguments),
			ev = args[args.length - 1],
			evname = ev.name,
			_listeners = me._listeners;
			
		switch (evname)
		{
		case "resize":
			var nw = me.$ex.$width, 
				nh = me.$ex.$height, 
				ow = me.$width, 
				oh = me.$height;
							
			if (nw != ow || nh != oh)
			{
				if (_listeners && _listeners[evname])
				{
					$.each(_listeners[evname], function(i, ev) {
						args.splice(0, 1, ev.scope);
						ev.f.apply(ev.scope, args);
					});
				}
				
				if (me._dockedItems && me._dockedItems.length)
				{
					$.each(me._dockedItems, function(i, item) {
						if (item.$ex)
						{
							item.chlidProcessEvents.call(item, item, item.$ex.$width, item.$ex.height, ev);
						}
					});
				}
				
				if (me._items && me._items.length)
				{
					$.each(me._items, function(i, item) {
						if (item.$ex)
						{
							item.chlidProcessEvents.call(item, item, item.$ex.$width, item.$ex.height, ev);
						}
					});
				}
			}
			
			me.$width = nw;
			me.$height = nh;
			break;
		}
	},
	
	processEvents: function() {
		var me = this,
			args = Array.prototype.slice.call(arguments),
			event = args[args.length-1],
			evname = event.name,
			_listeners = me._listeners,
			r;
		
		if (event._stopPropagation)
			return;
		
		if (evname == "afterrender" || evname == "resize")
		{
			event._stopPropagation = true;
			
			if (evname == "afterrender" && me.store)
			{
				me.store._refreshGrid.call(me.store);
			}
		}
			
		if (_listeners && _listeners[evname])
		{
			$.each(_listeners[evname], function(i, ev) {
				// args.splice(0, 1, ev.scope);
				var sr = ev.f.apply(ev.scope, args);
				
				if (sr === false)
					r = sr;
			});
			
			if (me.ownerCt)
			{
				var sr = me.processEvents.apply(me.ownerCt, args);
				
				if (sr === false)
					r = sr;
			}
		}
		
		return r;
	},
	
	suspendLayouts: function() {
		
	},
	
	resumeLayouts: function() {
		
	},
	
	suspendEvents: function() {
		
	},
	
	resumeEvents: function() {
		
	},
	
	fireEvent: function() {
		var me = this,
			args = Array.prototype.slice.call(arguments),
			eventname = args[0],
			r;
			
		args.splice(0, 1);
		
		args.push(me._createEvent.call(me, eventname));
		
		r = me.processEvents.apply(me, args);
		
		return r;
	},
	
	_createEvent: function(eventname, e) {
		var me = this,
			r = e || {};
			
		$s.apply(r, {
			name: eventname,
			_stopPropagation: false,
			_preventDefault: false,
			owner: me,
			getTarget: function() {
				return e.srcElement || e.target || e.currentTarget;
			},
			stopEvent: function() {
				this.stopPropagation();
				this.preventDefault();
			}
		});
				
		return r;
	},
	
	addEvents: function() {
		
	}
}

$s.selModel = function(config) {
	this.selected = {
		items: [],
		map: {},
		length: 0
	};
	
	$s.apply(this, config);
	
	this.checkSelector = this.checkSelector == ".x-grid-cell" ? "cell" : this.checkSelector;
}

$s.selModel.prototype = {
	select: function(rec, is_select) {
		var me = this,
			ownerCt = me.ownerCt,
			sel = me.selected,
			rdata,
			is_multi = me.mode == "MULTI",
			k;
			
		if (typeof(rec) == "number")
		{
			rec = ownerCt.store ? ownerCt.store.data.items[rec] || null : null;
		}
		
		if (!rec)
			return;
		
		rdata = rec.data;
					
		rec.data.checked = rec.data.selected = !is_multi ? true : (typeof(is_select) == "undefined" ? true : is_select);
		
		if (is_multi)
		{
			if (sel.map[rdata.id] && !rdata.selected)
			{
				sel.map[rdata.id] = 0;
				for (k=0; k < sel.items.length; k++)
				{
					if (sel.items[k].data.id == rdata.id)
					{
						sel.items.splice(k, 1);
						break;
					}
				}
			}
			else if (!sel.map[rdata.id] && rdata.selected)
			{
				sel.map[rdata.id] = 1;
				sel.items.push(rec);
			}
		}
		else
		{
			if (sel.length && sel.map[rdata.id] && !rdata.selected)
			{
				delete sel.map[rdata.id];
				sel.items.splice(0, sel.items.length);
			}
			else if (rdata.selected && !sel.map[rdata.id])
			{
				if (sel.length)
				{
					sel.items[0].set("selected", false);
					sel.items[0].set("checked", false);
					delete sel.map[sel.items[0].data.id];
					sel.items.splice(0, sel.items.length);
				}
				
				sel.items.push(rec);
				sel[0] = rec;
				sel.map[rdata.id] = 1;
				
				if (ownerCt.$dx)
					ownerCt.$dx.updateItem(rdata.id, rec);
			}
		}
		sel.length = sel.items.length;
		
		ownerCt.fireEvent.call(ownerCt, "selectionchange", ownerCt, sel);
	},
	
	clear: function() {
		this.$f = null;
		this.selected.map = {};
		this.selected.items = [];
		this.selected.length = 0;
	},
	
	isFocused: function(rec) {
		return rec.data.id == this.$f;
	},
	
	getSelection: function() {
		return this.selected.items;
	},
	
	$v/*validate*/: function() {
		var i,
			sel;
		
		for (i=this.selected.items.length-1; i>=0; i--)
		{
			sel = this.selected.items[i];
			
			if (!this.selected.map[sel.data.id])
			{
				this.selected.items.splice(i, 1);
			}
		}
		
		this.selected.length = this.selected.items.length;
	}
}

$s.record = function(data, uniqueid, store) {
	var me = this;
	me.store = store;
	me.data = data;
	me.__rec = 1;
	me.firstChild = null;
    me.childNodes = []
}

$s.record.prototype = {
	get: function(k) {
		var dt = this.$r ? (this.$r[k] || this.data[k]) : this.data[k];
		
		return dt;
	},
	set: function(k, value) {
		var me = this,
			dt = me.data,
			comp = me.store.grid,
			grid = comp.$dx;
		
		if (dt)
		{
			dt[k] = value;
			
			if (comp.xtype == "combobox")
			{
				if (me.$r)
				{
					me.$r[k] = value;
				}
				
				if (k == comp.displayField)
				{
				}
			}
			else
			{
				record = grid.getItem(dt.id);
				
				if (record)
				{
					record[k] = value;
		 
					// grid.refresh();

					grid.updateItem(dt.id, record);
				}
			}
		}
	},
	updatePull: function(pull) {
		var dt = this.data;
		pull[dt.id] = this;
	},
	
	expand: function(recursive, callback, scope) {
		var me = this,
			dx = me.store.grid.$dx,
			cb = callback ? new IG$/*mainapp*/._I3d/*callBackObj*/(scope, callback) : 0,
			bc = me.data.$count,
			post_open = 1;
		
		if (me.data.$count == 0)
		{
			me.data.$count = -1;
		}
		
		if (me.store._did == me.data.id)
			return;
			
		me.store._did = me.data.id;
		
		if (dx.isBranchOpen(me.data.id))
		{
			if (bc < 1)
			{
				dx.close(me.data.id);
			}
			else
			{
				post_open = 0;
				cb && cb.execute();
			}
		}
		
		if (post_open)
		{
			me.store.__cb = cb;
			dx.open(me.data.id, true);
		}
		
		me.store._did = null;
	},
	
	_doexp: function() {
		var node = this,
			rec = node,
			bload = 0,
			id = node.data.id,
			br,
			r,
			component = node.store.grid;
		
		if (rec.$count === -1)
		{
			bload = 1;
		}
		else if (rec.$count == 1 && node.childNodes[0].data._loading)
		{
			bload = 1;
		}
		
		if (bload)
		{
			if (component.store)
			{
				component.store._clearChild(node);
				delete rec._loading;
				
				r = component.fireEvent.call(component, "beforeitemexpand", node);
				
				if (r !== false)
				{
					if (component.store.proxy && component.store.proxy.type == "ajax")
					{
						component.store._loadNodeData.call(component.store, node);
					}
				}
			}
			
			rec.webix_kids = false;
			component.updateItem(id, rec);
		}
	},
	
	collapse: function() {
		var me = this,
			dx = me.store.grid.$dx;
			
		dx.close(me.data.id);
	},
	
	isExpanded: function() {
		var me = this,
			dx = me.store.grid.$dx;
		return dx.isBranchOpen(me.data.id);
	},
	
	isRoot: function() {
		return this.root || false;
	},
	
	isLeaf: function() {
		return this.data.leaf;
	},
	
	removeAll: function() {
		var rec = this.data,
			ditem,
			dx = this.store.grid.$dx;
		ditem = this.store.grid.$dx.getItem(rec.id);
		
		$.each(this.childNodes, function(n, c) {
			dx.remove(c.data.id);
		});
		
		this.childNodes = [];
		this.firstChild = this.childNodes[0];
	},
    
    insertChild: function(index, dt) {
        var me = this,
            records = [];
        if (typeof(dt) == "object" && dt.length)
        {
            $.each(dt, function(n, d) {
                var r = null;
                
                if (d.__rec)
                {
                    r = d;
                }
                else
                {
                    r = new $s.record(d, null, me.store);
                }
                records.push(r);
            });
        }
        else
        {
            if (dt.__rec)
			{
				dt.store = me.store;
				records.push(dt);
			}
			else
			{
				r = new $s.record(dt, null, me.store);
				records.push(r);
			}
        }
        
        me.store._insertNode.call(me.store, records, me, index);
		me.firstChild = me.childNodes[0];
		me.data.leaf = false;
    },
	
	appendChild: function(dt) {
		var me = this,
			r,
			records = [];
			
		if (me.childNodes && me.childNodes[0] && me.childNodes[0].data._loading)
		{
			me.removeChild(me.childNodes[0]);
		}
		
		if (typeof(dt) == "object" && dt.length)
		{
			$.each(dt, function(n, d) {
				var r = null;
				
				if (d.__rec)
				{
					r = d;
				}
				else
				{
					r = new $s.record(d, null, me.store);
				}
				records.push(r);
			});
		}
		else
		{
			if (dt.__rec)
			{
				dt.store = me.store;
				records.push(dt);
			}
			else
			{
				r = new $s.record(dt, null, me.store);
				records.push(r);
			}
		}
		me.store._appendNode.call(me.store, records, me);
		me.firstChild = me.childNodes[0];
		me.data.leaf = false;
	},
	
	removeChild: function(tnode) {
		var me = this,
			dx = me.store.grid.$dx,
			i,
			childNodes = me.childNodes;
			
		dx.remove(tnode.data.id);
		for (i=0; i < childNodes.length; i++)
		{
			if (childNodes[i].data.id == tnode.data.id)
			{
				childNodes.splice(i, 1);
				break;
			}
		}
		
		me.firstChild = childNodes[0];
	},
	
	hasChildNodes: function() {
		var me = this,
			dx = me.store.grid.$dx;
			
		return dx.getFirstChildId(me.get("id")) ? true : false;
	},
	
	$1/*init*/: function() {
		var data = this.data;
		delete data["id"];
		delete data["selected"];
	}
}

$s.dstore = $s.extend($s.object, {
	initComponent: function() {
		var me = this,
			odata = me.data;
		
		me.$data = odata;
		
		me.data = {
			items: [],
			length: 0
		};
		me.model = $s.record;
		$s.dstore.superclass.initComponent.call(me);
		// $s.store.superclass.initComponent.call(me);
	},
	
	_record: function(data) {
		var r = new $s.record(data, null, this);
		return r;
	},
	
	loadData: function(data) {
		var me = this,
			grid = me.grid,
			dx,
			i,
			records = [], lf, vf;
			
		me._pull = {};
		
		if (data)
		{
			if (grid.xtype == "combobox")
			{
				lf = grid.displayField;
				vf = grid.valueField;
				
				$.each(data, function(i, dt) {
					var mdt = IG$/*mainapp*/.copyObject(dt),
						rec = me._record(mdt);
					rec.$r = IG$/*mainapp*/.copyObject(dt);
					// if (!rec.data.id)
					//	rec.data.id = dt[vf];
					rec.data.value = mdt[lf];
					delete rec.data["label"];
					records.push(rec);
				});
			}
			else
			{
				$.each(data, function(i, dt) {
					var rec = me._record(dt);
					records.push(rec);
				});
			}
		}
			
		if (grid && grid.$dx)
		{
			dx = grid.$dx;
			
			if (grid.xtype == "combobox")
			{
				// dx = dx.getList();
				// dx.define("options", data);
				// dx.refresh();
				
				var mdt = [];
				
				$.each(records, function(i, rec) {
					mdt.push(rec.data);
				});
				
				dx.define("options", mdt);
				dx.refresh();
			}
			else
			{
				dx.clearAll();
				
				grid.selModel.clear();
				
				dx.parse(records, "ildr");
			}
			
			me._$d = null;
		}
		else
		{
			me._$d = data;
		}
		
		$.each(records, function(i, t) {
			me._pull[t.data.id] = t;
			
			if (grid.xtype != "combobox")
			{
				if (t.data.selected)
				{
					grid.selModel.selected.map[t.data.id] = 1;
					grid.selModel.selected.items.push(t);
					grid.selModel.selected.length++;
				}
			}
		});
				
		me.data = {
			items: records,
			length: records.length
		};
	},
	
	add: function(data) {
		var rec = this.insert(this.data.items.length, data);
		return rec;
	},
	
	insert: function(index, data) {
		var me = this,
			rec;
			
		this._pull = this._pull || {};
		if (!data.__rec && typeof(data) == "object" && data.length)
		{
			$.each(data, function(m, r) {
				var rec = (r.__rec ? r : me._record(r));
				rec.$1/*init*/();
				rec.store = me;
				me.grid.$dx.add(rec.data, index + m);
				me.data.items.splice(index + m, 0, rec);
				me._pull[rec.data.id] = rec;
			});
		}
		else
		{
			rec = (data.__rec ? data : me._record(data));
			rec.$1/*init*/();
			rec.store = this;
			me.grid.$dx.add(rec.data, index);
			me.data.items.splice(index, 0, rec);
			me._pull[rec.data.id] = rec;
		}
		
		me.$v1/*validate*/();
		
		return rec;
	},
	
	indexOf: function(rec) {
		var r = -1,
			i, records = me.data ? me.data.items : null;
		
		if (records)
		{
			for (i=0; i < records.length; i++)
			{
				if (records[i] == rec)
				{
					r = i;
					break;
				}
			}
		}
		
		return r;
	},
	
	filter: function() {
		var me = this,
			arg = arguments,
			flt,
			dx = me.grid.$dx;
			
		if (arg.length == 2)
		{
			dx.filter(function(obj) {
				return obj[arg[0]] == arg[1];
			});
		}
		// else
		// {
			// console.log(">> filter");
		// }
	},
	
	clearFilter: function() {
		this.grid.$dx.filter("");
	},
	
	remove: function(rec) {
		var me = this,
			i,
			sm,
			items = me.data.items,
			grid = me.grid,
			gl;
			
		for (i=0; i < items.length; i++)
		{
			if (items[i].data.id == rec.data.id)
			{
				items.splice(i, 1);
				break;
			}
		}
		
		if (grid.xtype == "combobox")
		{
			gl = grid.$dx.getList();
			gl.remove(rec.data.id);
		}
		else
		{
			grid.$dx.remove(rec.data.id);
		}
		delete me._pull[rec.data.id];
		
		sm = grid.getSelectionModel();
		delete sm.selected.map[rec.data.id];
		
		grid.$v/*validateSelection*/();
		
		this.$v1/*validate*/();
	},
	
	removeAt: function(index) {
		var me = this,
			rec = me.data.items[index];
			
		if (rec)
		{
			me.remove(rec);
		}
	},
	
	indexOf: function(rec) {
		return this.grid.$dx.getIndexById(rec.data.id);
	},
	
	getCount: function() {
		return this.data.items.length;
	},
	
	getNode: function(n) {
		var rec = this.data.items[n];
		
		return this.grid.$dx.getItemNode(rec.data.id);
	},
	
	getAt: function(rowindex) {
		var me = this,
			dx = me.grid.$dx;
			
		var did = dx.getIdByIndex(rowindex);
		
		return me._pull[did];
	},
	
	/****************** treestore ************************/
	getRootNode: function() {
		return this.root;
	},
	
	setRootNode: function(r) {
		var me = this;
			
		me.root = me._record(r);
		me.root.webix_kids = true;
		me.root.data.webix_kids = true;
		me.root.root = me.root.data.root = true;
		me.root.data.id = 0;
		
		if (me.root.data.iconcls)
		{
			me.root.data.icon = " " + me.root.data.iconcls;
		}
		
		me._pull = {};
		
		me._refreshGrid();
		
		return me.root;
	},
	
	_refreshGrid: function() {
		var me = this,
			grid = me.grid,
			dx,
			i;
			
		if (grid && grid.$dx && me.root)
		{
			dx = me.grid.$dx;
			
			dx.clearAll();
			dx.parse([me.root], "ildr");
			me.root.updatePull(me._pull);
			
			if (me.root.data.children && me.root.data.children.length)
			{
				me._buildChild(me.root.data.children, me.root);
			}
		}
		else if (grid && me._$d)
		{
			me.loadData(me._$d);
		}
		
		me.$v1/*validate*/();
	},
	
	_buildChild: function(childs, parent) {
		var me = this,
			records = [];
		
		$.each(childs, function(i, c) {
			var r = new $s.record(c, null, me);
			records.push(r);
		});
		
		delete parent["children"];
		
		me._appendNode(records, parent);
	},
	
	clearData: function() {
		this.loadData([]);
	},
	
	_loadNodeData: function(node) {
		var me = this,
			proxy = me.proxy,
			param,
			r;
			
		r = me.fireEvent.call(me, "beforeload", me, {
			node: node
		});
		
		param = proxy.extraParams;
		
		if (r == false)
			return;
		var req = new IG$/*mainapp*/._I3e/*requestServer*/();
		req.init(me, 
			{
	            ack: param.ack,
	            payload: param.payload,
	            mbody: param.mbody
	        }, me, function(xdoc) {
	        	var me = this,
	        		operation = {
		        		node: node,
		        		setCompleted: function() {
		        		},
		        		setSuccessful: function() {
		        		}
		        	}, 
		        	records,
		        	i;
	        	
	        	me.proxy.processResponse.call(me, true, operation, null/*request*/, xdoc);
	        	
	        	records = operation.resultSet.records;
	        	
	        	me._appendNode(records, node);
	        	
	        	me.fireEvent.call(me, "itemexpand", me, {
	        		node: node
	        	});
				
				if (me.__cb)
				{
					me.__cb.execute();
					me.__cb = null;
				}
	        }, false);
		req._l/*request*/();
	},
	
	_clearChild: function(node) {
		var me = this,
			grid = me.grid,
			dx = grid.$dx,
			data = node.data,
			children = node.childNodes;
			
		$.each(children, function(i, k) {
			dx.remove(k.data.id);
			delete me._pull[k.data.id];
		});
		
		node.childNodes = [];
		node.firstChild = null;
	},
	
	_appendNode: function(records, node) {
		var me = this,
			grid = me.grid,
	        dx = grid.$dx,
	        b,
			i,
			srecs;
		
		delete node["webix_kids"];
		delete node.data["webix_kids"];
		node.childNodes = node.childNodes || [];
		
		for (i=records.length-1; i>=0; i--)
		{
			if (!records[i].store)
			{
				records[i].store = me;
			}
			
			if (!records[i].store)
			{
				throw "store bind error";
			}
			
			records[i].parentNode = node;
			
			if (records[i].data.iconcls || records[i].data.iconCls)
			{
				records[i].data.icon = " " + (records[i].data.iconcls || records[i].data.iconCls);
			}
			
			dx.add(records[i].data, 0, node.data.id);
			
			if (records[i].data.children)
			{
				srecs = [];
				$.each(records[i].data.children, function(n, p) {
					var b = new $s.record(p, null, me);
					srecs.push(b);
				});
				delete records[i].data["children"];
				me._appendNode(srecs, records[i]);
			}
			else if (records[i].data.leaf == false)
			{
				b = new $s.record({is_loading: 1});
				records[i].childNodes = [b];
				b.data._loading = 1;
				dx.add(records[i].childNodes[0].data, 0, records[i].data.id);
			}
			
			me._pull[records[i].data.id] = records[i];
			node.childNodes.push(records[i]);
		}
		
		node.firstChild = node.childNodes[0];
		node.data.leaf = false;
	},
    
    _insertNode: function(records, node, index) {
		var me = this,
			grid = me.grid,
	        dx = grid.$dx,
	        b,
			i,
			srecs,
            n = 0;
		
		delete node["webix_kids"];
		delete node.data["webix_kids"];
		node.childNodes = node.childNodes || [];
		
		for (i=records.length-1; i>=0; i--)
		{
			if (!records[i].store)
			{
				records[i].store = me;
			}
			
			if (!records[i].store)
			{
				throw "store bind error";
			}
			
			records[i].parentNode = node;
			
			if (records[i].data.iconcls || records[i].data.iconCls)
			{
				records[i].data.icon = " " + (records[i].data.iconcls || records[i].data.iconCls);
			}
			
			dx.add(records[i].data, index + (n++), node.data.id);
			
			if (records[i].data.children)
			{
				srecs = [];
				$.each(records[i].data.children, function(n, p) {
					var b = new $s.record(p, null, me);
					srecs.push(b);
				});
				delete records[i].data["children"];
				me._appendNode(srecs, records[i]);
			}
			else if (records[i].data.leaf == false)
			{
				b = new $s.record({is_loading: 1});
				records[i].childNodes = [b];
				b.data._loading = 1;
				dx.add(records[i].childNodes[0].data, 0, records[i].data.id);
			}
			
			me._pull[records[i].data.id] = records[i];
			node.childNodes.push(records[i]);
		}
		
		node.firstChild = node.childNodes[0];
		node.data.leaf = false;
	},
	
	getReader: function() {
		var me = this;
		
		if (!me.__reader)
		{
			me.__reader = new $s.reader(me.proxy.reader);
			me.__reader.model = $s.record;
		}
		
		return me.__reader;
	},
	
	extractResponseData: function(response) {
		return {
			responseXML: response
		}
	},
	afterRequest: function(request, success) {
		
	},
	
	/* filtering grid */
	clearFilter: function(update) {
		var me = this,
			grid = me.grid,
			dx = grid.$dx;
			
		dx.filter();
	},
	
	filterBy: function(f) {
		var me = this,
			grid = me.grid,
			dx = grid.$dx;
			
		dx.filter(function(obj) {
			var rec = me._pull[obj.id];
			
			return f.apply(me, [rec]);
		});
	},
	
	$v1/*validate*/: function() {
		this.data.length = this.data.items.length;
	}
});

$s.column = $s.extend($s.object, {
	show: function() {
		this.setVisible(true);
	},
	hide: function() {
		this.setVisible(false);
	},
	setVisible: function(visible) {
		var me = this,
			g = me.$g,
			dx = g.$dx,
			c;
			
		if (dx)
		{
			c = dx.getColumnIndex(me.$col.id);
			
			if ((c == -1 && visible) || (c > -1 && !visible))
				dx[visible ? "showColumn" : "hideColumn"](me.$col.id);
		}
	},
	
	setText: function(value) {
		
	}
});

$s.tabbutton = $s.extend($s.object, {
	show: function() {
		this.setVisible(true);
	},
	hide: function() {
		this.setVisible(false);
	},
	setVisible: function(visible) {
		var me = this,
			tabbar = me.tabbar,
			mt = tabbar.$mt;
			
		if (mt)
		{
			mt[visible ? "showOption" : "hideOption"](me.tabid);	
		}
	}
});

$s.base = $s.extend($s.object, {
	initComponent: function() {
		var me = this;
		
		me.body = new $s.body(me);
		me.el = new $s.body(me, 1);
		
		me.createComponent();
		
		$s.base.superclass.initComponent.call(me);
		
		if (me.renderTo)
		{
			var prop = me.updateViewProp(me),
				cdx;
				
			prop.container = me.renderTo;
			prop.__container = me.renderTo;
			cdx = webix.ui(prop);
			
			if (cdx && typeof cdx == "string")
			{
				cdx = $$(cdx);
			}
			
			me._postAddView(me, cdx, null, true, null, 0, 0, 0, null);
		}
	},
	
	getView: function() {
		return this;
	},
	
	refresh: function() {
		
	},
	
	getNode: function(i) {
		var me = this,
			store = me.store;
			
		return store.getNode(i);
	},
	
	addDock: function(component) {
		var me = this,
			_pdc = me["$dc" + (component.dock == "top" ? 1 : 2)];
		
		me.add(component, 1, _pdc);
	},
	
	addMenu: function(component, inpersist) {
		var me = this,
			popup,
			m;
		
		if (!component.__mbase)
		{
			component = me.updateComponentClass(component);
		}
		
		if (inpersist)
		{
			me._dMenu(component);
		}
	},
	
	_dMenu: function(component) {
		var me = this,
			m,
			inpersist = 1;
		
		m = component._createMenuUI.call(component, inpersist);
		
		if (typeof(m) == "string")
		{
			m = $$(m);
		}
		
		if (m)
		{
			me.$pm = {
				$dx: m,
				comp: component
			};
		}
	},
	
	callParent: function() {
		var method = this.callParent.caller;
		
		method.$owner = method.$owner || this.constructor();

        return (method) && (method.$previous ||
              ((method = method.$owner ? method : method.caller) &&
                    method.$owner.superclass[method.$name])).apply(this, args || noArgs);
	},
	
	onAdd: function(item, index) {
		var me = this,
			tabbar = me.getTabBar(),
			i, mt, opt,
			pitems,
			pw, ph;
			
		if (tabbar)
		{
			tabbar.validate();
		}
		else if (me.xtype == "tabpanel")
		{
			mt = me.$mt;
			
			if (mt)
			{
				me.$tid = me.$tid || 0;
				
				pitems = me._items;
				for (i=0; i < pitems.length; i++)
				{
					if (!pitems[i].tab)
					{
						opt = { 
							id: me.$tid++,
							name: pitems[i].title,
							value : "<span>" + pitems[i].title + "</span>", 
							close: pitems[i].closable,
							$c: pitems[i]
						};
						
						if (pitems[i].iconCls)
						{
							opt.icon = " icon-c-fix " + pitems[i].iconCls;
						}
						pitems[i].tab = new $s.tabbutton({
							tabbar: me,
							ownerCt: pitems[i],
							tabid: opt.id
						});
						mt.addOption(opt, (i == 0) ? true : false);
					}
				}
				
				mt.refresh();
			}
		}
		
//		if (me.ownerCt && me.ownerCt.xtype == "tabpanel")
//		{
//			me.tab = me.tab || new $s.tabbutton({
//				tabbar: me.ownerCt,
//				ownerCt: me
//			});
//		}
	},
	
	onRemove: function(item, destroy) {
		var panel = this;
		panel.remove(item);
	},
	
	add: function(component, isdock, _pdc) {
		var me = this,
			i;
		
		if (typeof(component) == "object" && component.length)
		{
			$.each(component, function(i, c) {
			// for (i=0; i < component.length; i++)
			//{
			//	var c = component[i];
				me.add.call(me, c, isdock, _pdc);
			//}
			});
			
			return;
		}
		
		var dx = _pdc || me.$dx,
			views,
			cls,
			
			cview,
			prop;
		
		component.ownerCt = me;
		
		me.fireEvent.call(me, "beforeadd");
		
		if (!component.__mbase)
		{
			component = me.updateComponentClass(component);
		}
		
		if (isdock)
		{
			me._dockedItems.push(component);
		}
		else
		{
			me._items.push(component);
		}
		
		if (component.parent && component.parent.xtype == "toolbar")
		{
			component.parent.show(true);
		}
		
		me.items.length = me._items.length;
		
		if (_pdc)
		{
			_pdc.show();
			
			me.addViewItem(component, me, 1, _pdc);
		}
		else if (dx)
		{
			me.addViewItem(component, me);
		}
		
		return component;
	},
	
	remove: function(item) {
		var me = this,
			i,
			_items = me._items;
		for (i=0; i < _items.length; i++)
		{
			if (_items[i] == item)
			{
				_items.splice(i, 1);
				break;
			}
		}
		
		me.items.length = _items.length;
		
		item.hide();
	},
	
	removeAll: function() {
		var me = this,
			i,
			_items = me._items;
		
		for (i=_items.length-1; i>=0; i--)
		{
			_items[i].hide();
			_items.splice(i, 1);
		}
		
		me.items.length = _items.length;
	},
	
	getValue: function() {
		var val,
			me = this,
			xtype = me.xtype;
		
		if (xtype == "radiogroup")
		{
			val = me.getRadioGroupValue();
		}
		else if (xtype == "checkboxgroup")
		{
			val = me.getCheckGroupValue();
		}
		else if (xtype == "combobox")
		{
			val = me.getComboValue();
		}
		else if (xtype == "htmleditor")
		{
			val = me.sview[1].getValue();
		}
		else if (xtype == "checkbox")
		{
			val = me.$dx ? me.$dx.getValue() : false;
			val = (me.inputValue === val || val) ? true : false;
		}
		else
		{
			val = me.$dx && me.$dx.getValue ? me.$dx.getValue() : null;
		}
		return val;
	},
	
	getGroupValue: function() {
		var me = this,
			r;
		if (me.xtype == "radiogroup")
		{
			r = me.getRadioGroupValue();
			if (r)
			{
				r = r[me.$options[0].name];
			}
		}
		
		return r;
	},
	
	getHTMLValue: function() {
		var r = null,
			me = this;
		if (me.xtype == "htmleditor")
		{
			r = me.sview[2].getValue();
		}
		return r;
	},
	
	getComboValue: function() {
		var nv,
			component = this,
			id = component.$dx.getValue(),
			i,
			rec;
			
		for (i=0; i < component.store.data.items.length; i++)
		{
			rec = component.store.data.items[i];
			if (rec.data.value == id || rec.data.id == id)
			{
				nv = rec.$r[component.valueField];
				break;
			}
		}
		
		return nv;
	},
	
	getRadioGroupValue: function(sval) {
		var dx = this.$dx,
			dval = sval || dx.getValue(),
			options = this.$options,
			i, sval = {};
			
		for (i=0; i < options.length; i++)
		{
			if (options[i].value == dval)
			{
				// sval[options[i].name] = options[i].inputValue;
				sval[options[i].name] = options[i].inputValue;
				break;
			}
		}
		
		return sval;
	},

	getCheckGroupValue: function() {
		var r = {},
			me = this,
			_items = me._items,
			i, j,
			b,
			inputValue, ivalue,
			name;

		for (i=0; i<_items.length; i++)
		{
			name = _items[i].name;
			inputValue = _items[i].inputValue;
			b = _items[i].$dx.getValue();

			if (b)
			{
				r[name] = r[name] || [];
				r[name].push(inputValue);
			}
		}

		return r;
	},
	
	setReadOnly: function(value) {
		this.$dx[value ? "disable" : "enable"]();
	},
	
	setValue: function(value) {
		var me = this;
		
		if (me.$dx)
		{
			if (me.xtype == "combobox")
			{
				me.setComboValue(value);
			}
			else if (me.xtype == "checkboxgroup")
			{
				me.setCheckGroupValue(value);
			}
			else if (me.xtype == "radiogroup")
			{
				me.setRadioGroupValue(value);
			}
			else if (me.xtype == "htmleditor")
			{
				me.sview[1].setValue(value);
			}
			else if (me.xtype == "checkbox")
			{
				if (me.inputValue)
				{
					me.$dx.setValue(me.inputValue == value || value === true);
				}
				else
				{
					me.$dx.setValue(value);
				}
				me.$dx.refresh();
			}
			else
			{
				me.$dx.setValue(value || "");
				me.$dx.refresh();
			}
		}
	},
	
	setHTMLValue: function(value) {
		var r = null,
			me = this;
			
		if (me.xtype == "htmleditor")
		{
			r = me.sview[2].setValue(value);
		}
		return r;
	},
	
	setComboValue: function(value) {
		var component = this,
			i,
			rec,
			vfield = component.valueField,
			r;
			
		for (i=0; i < component.store.data.items.length; i++)
		{
			r = component.store.data.items[i];
			if (r.data.value == value || r.$r[vfield] == value)
			{
				rec = r;
				break;
			}
		}
		
		if (rec)
		{
			component.$dx.setValue(rec.get("id"));
			component.$dx.refresh();
		}
	},

	setCheckGroupValue: function(value) {
		var me = this,
			_items = me._items,
			i, j,
			b,
			inputValue, ivalue,
			name;

		for (i=0; i<_items.length; i++)
		{
			name = _items[i].name;
			inputValue = _items[i].inputValue;
			b = false;
			ivalue = value[name];
			if (ivalue)
			{
				for (j=0; j < ivalue.length; j++)
				{
					if (ivalue[j] == inputValue)
					{
						b = true;
						break;
					}
				}
			}

			_items[i].$dx.setValue(b);
		}
	},
	
	setRadioGroupValue: function(value) {
		var me = this,
			options = me.$options,
			i, j,
			b,
			inputValue, ivalue,
			name;

		for (i=0; i < options.length; i++)
		{
			name = options[i].name;
			inputValue = options[i].inputValue;
			b = false;
			ivalue = value[name];
			if (value == inputValue || (ivalue && ivalue == inputValue))
			{
				b = true;
//				for (j=0; j < ivalue.length; j++)
//				{
//					if (ivalue[j] == inputValue)
//					{
//						b = true;
//						break;
//					}
//				}
			}
			
			if (b)
			{
				me.$dx.setValue(options[i].value);
				me.$dx.refresh();
				
				break;
			}
		}
	},
	
	getStore: function() {
		return this.store;
	},
	
	getSelectionModel: function() {
		if (!this.selModel)
		{
			this.selModel = new $s.selModel({});
		}
		this.selModel.ownerCt = this;
		return this.selModel;
	},
	
	$v/*validateSelection*/: function() {
		var me = this;
		setTimeout(function() {
			var s = me.getSelectionModel.call(me);
			
			s.$v/*validate*/.call(s);
		}, 0);
	},
	
	select: function(value) {
		var me = this,
			dx = me.$dx,
			store = me.store,
			mv;
			
		if (dx)
		{
			if (me.xtype == "combobox")
			{
				me.setComboValue(value);
			}
			else if (value.get)
			{
				dx.select(value.get("id"));
			}
		}
	},
	
	clearInvalid: function() {
		var dx = this.$dx,
			view = $(dx.$view);
			
		view.removeClass("igc-invalid");
	},
	
	setInvalid: function(msgs) {
		this.markInvalid(msgs);
	},
	
	markInvalid: function(msgs) {
		var dx = this.$dx,
			view = $(dx.$view);
			
		view.addClass("igc-invalid");
	},
	
	isvalid: function() {
		var me = this,
			v, valid = true;
		
		if (me.required || me.allowBlank == false)
		{
			me.clearInvalid();
			
			v = me.getValue();
			
			if (!v)
			{
				valid = false;
				me.markInvalid();
			}
		}
		
		return valid;
	},
	
	setTitle: function(value) {
		var me = this,
			h, vs,
			label,
			views,
			h;
		
		if (me.xtype == "window")
		{
			h = me.$ex.getHead();
			vs = h.getChildViews();
			
			if (vs && vs.length)
			{
				label = vs[0];
				
				label.setHTML(value);
			}
		}
		else if (me.ownerCt && me.ownerCt.tabBar)
		{
			me.title = value;
			me.ownerCt.tabBar.validate();
		}
		else if (me.$ex)
		{
			views = me.$ex.getChildViews();
			if (views && views.length > 1)
			{
				h = views[0].getChildViews();
				if (h && h.length && h[0].config.view == "label")
				{
					h[0].setValue(value);
					h[0].refresh();
				}
			}
		}
	},
	
	setFieldLabel: function(value) {
		var me = this,
			dx = me.$dx;
			
		if (me.xtype == "fieldcontainer")
		{
		}
		else if (dx && dx.define && dx.refresh)
		{
			dx.define("label", value);
			dx.refresh();
		}
	},
	
	setText: function(value) {
		var me = this,
			dx = me.$dx;
		if (dx)
		{
			if (me.xtype == "button")
			{
				dx.define("label", value);
				dx.define("autowidth", true);
				dx.refresh();
				dx.resize();
			}
			else
			{
				dx.setValue(value);
				dx.refresh();
				dx.resize();
			}
		}
	},
	
	toggle: function() {
		//TODO: implement
	},
	
	setTooltip: function(value) {
		//TODO: implement
	},
	
	setLoading: function(visible) {
		IG$/*mainapp*/._I57/*IngPanel*/.prototype.setLoading.call(this, visible);
	},
	
	updateComponentClass: function(component) {
		var me = this;
		
		if (component == "-" || component == " ")
		{
			component = {
				xtype: "split"
			};
		}
		else if (component == "->")
		{
			component = {
				xtype: "spacer"
			};
		}
		
		if (me.defaults)
		{
			$s.apply(component, me.defaults);
		}
		
		if (!component.xtype)
		{
			if (me.defaultType)
			{
				component.xtype = me.defaultType;
			}
			else if (me.defaults && me.defaults.xtype)
			{
				component.xtype = me.defaults.xtype;
			}
			else if (component.autoLoad && component.autoLoad.url)
			{
				component.xtype = "html";
			}
			else if (component.ownerCt && component.ownerCt.xtype == "toolbar")
			{
				component.xtype = "button";
			}
			else if (component.ownerCt && component.ownerCt.xtype == "menu")
			{
				component.xtype = "menuitem";
			}
			else if (component.ownerCt && component.ownerCt.xtype == "checkboxgroup")
			{
				component.xtype = "checkbox";
			}
		}
		
		component.xtype = component.xtype || "container";
		
		if (component.xtype == "grid")
		{
			component.xtype = "gridpanel";
		}
		else if (component.xtype == "form")
		{
			component.xtype = "formpanel";
		}
		
		component = me.createClassComp(component);
		component.ownerCt = me;
		
		return component;
	},
	
	createComponent: function() {
		var me = this,
			dx,
			items = me.items,
			dockedItems = [],
			prop,
			cls,
			i, T0, T1, sm;
						
		me._items = [];
		me.items = {
			items: me._items
		};
		
		me._dockedItems = [];
		
		if (me.tbar)
		{
			if (typeof(me.tbar) == "object" && me.tbar.length)
			{
				dockedItems.push({
					xtype: "toolbar",
					dock: "top",
					layout: {
						type: "hbox"
					},
					items: me.tbar
				});
			}
			else
			{
				$s.apply(me.tbar, {
					xtype: "toolbar",
					layout: {
						type: "hbox"
					},
					dock: "top"
				});
				
				dockedItems.push(me.tbar);
			}
		}
		
		if (me.bbar)
		{
			if (typeof(me.bbar) == "object" && me.bbar.length)
			{
				dockedItems.push({
					xtype: "toolbar",
					dock: "bottom",
					items: me.bbar
				});
			}
			else
			{
				$s.apply(me.bbar, {
					xtype: "toolbar",
					dock: "botton"
				});
				dockedItems.push(me.bbar);
			}
		}
		
		if (me.buttons && me.buttons.length)
		{
			var bspace = 0;
			for (i=0; i < me.buttons.length; i++)
			{
				if (me.buttons[i] == "->")
				{
					bspace = 1;
					break;
				}
			}
			
			if (!bspace)
			{
				me.buttons.splice(0, 0, "->");
			}
			var dbuttons = {
				xtype: "toolbar",
				dock: "bottom",
				items: me.buttons
			};
			
			dockedItems.push(dbuttons);
		}
		
		if (me.dockedItems && me.dockedItems.length)
		{
			for (i=0; i < me.dockedItems.length; i++)
			{
				if (me.dockedItems[i])
				{
					me.dockedItems[i].layout = {
						type: "hbox"
					};
					dockedItems.push(me.dockedItems[i]);
				}
			}
		}
		
		me.dockedItems = {
			items: me._dockedItems
		}
		
		if (me.layout && typeof(me.layout) == "string")
		{
			me.layout = {
				type: me.layout
			};
		}
		else if (!me.layout)
		{
			if (me.xtype == "checkboxgroup")
			{
				me.layout = {
					type: "hbox"
				};
			}
			else
			{
				me.layout  = {
					type: "fit"
				};
			}
		}
		
		if (me.store)
		{
			if (!me.store.__mbase)
			{
				me._store = me.store;
				me._store.xtype = me._store.xtype || "store";
				me._store.grid = me;
				me.store = me.createClassComp(me._store);
			}
			
			if (me.store.root)
			{
				me.store.setRootNode(me.store.root);
			}
			else if (me.root)
			{
				me.store.setRootNode(me.root);
			}
		}
		
		if (me.html)
		{
			me.xtype = "html";
		}
		
		switch (me.xtype)
		{
		case "viewport":
			prop = {
				// container: document.body,
				type: "line",
				padding: 0,
				margin: 0,
				autowidth:true,
				autoheight: true
			};
			
			if (me.id && document.getElementById(me.id))
			{
				prop.container = me.id;
			}
			
			var doc = $(document),
				dw = doc.width(),
				dh = doc.height();
				
			// prop.width = dw;
			/// prop.height = dh;
			
			webix.ui.fullScreen();
			prop = me.updateViewProp(me, prop);
			dx = webix.ui(prop);
			
			webix.event(window, "resize", function(){
				var doc = $(document),
					dw = doc.width(),
					dh = doc.height();
					
				// dx.$setSize(dw, dh);
				dx.adjust();
				
				me.chlidProcessEvents.call(me, me, dw, dh, me.$width, me.$height, {
					name: "resize",
					_stopPropagation: false,
					_preventDefault: false,
					owner: me,
					down: true
				});
			});
			
			//dx.$setSize(dw, dh);
			dx.adjust();
			
			me.$ex = dx;
			me.updateViewElement(dx);
			break;
		default:
			break;
		}
		
		// if (me.xtype == "tabpanel")
		// {
			// console.log(">> tabpanel");
		// }
		
		if (items && items.length)
		{
			$.each(items, function(i, item) {
				me.add.call(me, item);
			});
		}
		
		if ((me.xtype == "window" || me.xtype == "panel" || me.xtype == "gridpanel" || me.xtype == "treepanel") && dockedItems.length)
		{
			$.each(dockedItems, function(i, item) {
				me.addDock.call(me, item);
			});
		}
		
		if ((me.ownerCt && me.ownerCt.$dx && prop) || me.xtype == "window")
		{
			me.addViewItem(me, me.ownerCt);
		}
		
		if (me.xtype == "gridpanel" || me.xtype == "treepanel" || me.xtype == "dataview")
		{
			sm = me.selModel;
			
			if (sm)
			{
				sm = me.selModel = new $s.selModel(sm);
			}
			else
			{
				sm = me.selModel = me.getSelectionModel();
			}
			
			sm.selType = sm.selType || me.selType;
			sm.ownerCt = me;
			
			if (!sm.mode)
			{
				if (me.store && me.store.fields && me.store.fields.length)
				{
					for (i=0; i < me.store.fields.length; i++)
					{
						if (me.store.fields[i] == "selected")
						{
							sm.mode = "MULTI";
							break;
						}
					}
				}
				
				if (!sm.mode)
				{
					switch (sm.selType)
					{
					case "checkboxmodel":
						sm.mode = "MULTI";
						break;
					case "treemodel":
						sm.mode = "SINGLE";
						break;
					}
				}
			}
		}
		
		if (me.menu)
		{
			if (me.xtype != "menuitem")
			{
				me.addMenu.call(me, me.menu, 0);
			}
			else
			{
				me.submenu = [];
				
				if (typeof(me.menu) == "object" && me.menu.xtype == "menu")
				{
					me.menu = me.updateComponentClass(me.menu);
				}
				else 
				{
					me.menu = me.updateComponentClass({
						xtype: "menu",
						items: me.menu
					})
				}
			}
		}
	},
	
	createClassComp: function(component) {
		var cls = $s[component.xtype];
			
		if (cls)
		{
			component = new cls(component);
		}
		else
		{
			throw "xtype error : " + component.xtype;
		}
		
		return component;
	},
	
	setPosition: function(x, y) {
		var me = this;
		
		me.$ex && me.$ex.setPosition(x, y);
		
		me.fireEvent.call(me, "move", me, x, y, null);
	},
	
	isVisible: function() {
		if (this.$ex && this.$ex.isVisible)
		{
			return this.$ex.isVisible();
		}
		return false;
	},
	
	setVisible: function(visible, internal) {
		var me = this,
			v = visible ? "show" : "hide",
			max_parent = 10,
			pcnt = 0,
			ownerCt,
			px;
		
		if (me.$ex)
		{
			me.$ex[v]();
		}
		
		if (me.$sx)
		{
			me.$sx[v]();
		}
		
		me.hidden = !visible;
		
		ownerCt = me.ownerCt;
		
		if (ownerCt && (ownerCt.xtype == "menu" || ownerCt.xtype == "menuitem"))
		{
			px = ownerCt.$px;
			
			if (px)
			{
				var vm = px.getMenu(me._menukey);
				if (vm)
				{
					vm[m.hidden ? "hide" : "show"]();
				}
			}
		}
		
//		while (pcnt < max_parent && ownerCt && ownerCt.$ex)
//		{
//			if (ownerCt.ownerCt && ownerCt.ownerCt.$ex)
//			{
//				ownerCt = ownerCt.ownerCt;
//			}
//			else
//			{
//				break;
//			}
//			pcnt++;
//		}
		
		if (ownerCt && ownerCt.$ex)
		{
			ownerCt._vsize.call(ownerCt, 0, 0, 1);
		}
	},
	
	expand: function() {
		var me = this,
			c;
		
		if (me.xtype == "fieldset")
		{
			if (me.checkboxCmp)
			{
				me.checkboxCmp.setValue(true);
				// 
			}
		}
	},
	
	collapse: function() {
		var me = this,
			c;
		
		if (me.xtype == "fieldset")
		{
			if (me.checkboxCmp)
			{
				me.checkboxCmp.setValue(false);
				// c = $("#igc_fs_toggle")
			}
		}
	},
	
	setDisabled: function(disable) {
		var me = this;
		
		if (me.$dx)
		{
			me.$dx[disable ? "disable" : "enable"]();
		}
	},
	
	show: function(internal) {
		var me = this;
		
		if (me.xtype == "window")
		{
			setTimeout(function() {
				me.$ex.show();
				
				me.rendered = 1;
				me.fireEvent.call(me, "afterrender", me);
			}, 10);
		}
		else
		{
			me.setVisible(true, internal);
		}
	},
	hide: function(internal) {
		this.setVisible(false, internal);
	},
	
	getWidth: function() {
		return this.$width;
	},
	
	getHeight: function() {
		return this.$height;
	},
	
	setWidth: function(n) {
		this.changeSize(n, "width");
	},
	
	setHeight: function(n) {
		this.changeSize(n, "height");
	},
	
	setSize: function(w, h) {
		var me = this,
			dx = me.$dx,
			ex = me.$ex;
		
		if (dx)
		{
			ex.define("width", w);
			ex.define("height", h);
			ex.resize();
			
			dx.define("width", w);
			dx.define("height", h);
			dx.resize();
			
			if (me.ownerCt)
			{
				me.ownerCt._vsize.call(me.ownerCt);
			}
			else
			{
				me._vsize.call(me);
			}
		}
	},
	
	changeSize: function(n, t) {
		var me = this,
			dx = me.$dx,
			ex = me.$ex;
		
		if (dx)
		{
			ex.define(t, n);
			ex.resize();
			
			dx.define(t, n);
			dx.resize();
			
			me.ownerCt && me.ownerCt._vsize.call(me.ownerCt);
		}
	},
	
	close: function() {
		var me = this,
			ex = me.$ex;
			
		if (ex)
		{
			if (me.ownerCt && me.ownerCt.tabBar && me.ownerCt.tabBar.xtype == "tabbar")
			{
				me.ownerCt.tabBar.removeTab.call(me.ownerCt.tabBar, me.tab.tabid);
			}
			else
			{
				ex.close && ex.close();
				ex.destructor();
				me.$ex = null;
				
				me.fireEvent.call(me, "close", me);
			}
		}
	},
	
	doLayout: function() {
		var me = this;
		
		if (me.isviewport == true)
		{
			
		}
		
		// me.$ex && me.$ex.adjust && me.$ex.adjust();
	},
	
	doComponentLayout: function() {
		
	},
	
	getColumnIndex: function(id) {
		var i,
			c = -1,
			component = this;
		
		if (id.column == "selected" && component.$7f)
		{
			c = 0;
		}
		else
		{
			for (i=0; i < component.columns.length; i++)
			{
				if (component.columns[i].dataIndex == id.column)
				{
					c = i;
					break;
				}
			}
			
			if (c > -1 && component.$7f)
			{
				c += 1;
			}
		}
		
		return c;
	},
	
	updateViewProp: function(component, prop) {
		var me = component,
			iconfig = component._iconfig || {},
			lprop, eprop, dprop,
			iscontainer,
			isformfield,
			iscolumn,
			idoc,
			_t0,
			i,
			_sep;
		
		prop = prop || {};
		
		if (component.width && isNaN(component.width) == false)
		{
			prop.width = component.width;
		}
		else if (component.$w && isNaN(component.$w) == false)
		{
			prop.width = component.$w;
		}
		
		if (component.height && isNaN(component.height) == false)
		{
			prop.height = component.height;
		}
		else if (component.$h && isNaN(component.$h) == false)
		{
			prop.height = component.$h;
		}
		
		if (component.$v)
		{
			$s.apply(prop, component.$v);
		}
		
		if (component.minHeight)
		{
			prop.minHeight = component.minHeight;
		}
		
		if (component.flex)
		{
			prop.gravity = component.flex;
		}
		
		// prop.type = "clean";
		
		prop.hidden = component.hidden;
		
		if (component.bodyCls)
		{
			prop.css = component.bodyCls;
		}
		
		if (component.autoScroll || (component.autoScroll !== false && component.ownerCt && component.ownerCt.xtype == "tabpanel"))
		{
			prop.scroll = true;
		}
		
		lprop = prop;
		eprop = prop;
		
		switch (component.xtype)
		{
		case "fieldcontainer":
			prop.adjust = true;
		case "container":
			iscontainer = 1;
			break;
		case "panel":
		case "formpanel":
			prop.view = "form";
			idoc = 1;
		case "viewport":
            prop.borderless = true;
			iscontainer = 1;
			if (component.xtype == "panel" && component.renderTo && component.frameHeader !== false)
			{
				isdoc = 0;
				iscontainer = 1;
				prop.view = "wpanel";
				prop.modal = false;
				prop.move = true;
				prop.resize = true;
				prop.autofocus = true;
				component._window = 1;
				prop.container = component.renderTo;
				prop.position = function(state) {
					state.top = component.y;
					state.left = component.x;
				};
				prop.on = prop.on || {};
				prop.on.onViewMove = function(pos, e) {
					var top = component.$ex.getNode().offsetTop,
						left = component.$ex.getNode().offsetLeft;
						// creg = $(component.renderTo),
						// coff = creg.offset(),
						// ctop = coff.top,
						// cleft = coff.left;
						
					component.fireEvent.call(component, "move", component, left, top, e);
				};
				prop.on.onViewMoveEnd = function() {
					
				};
//				prop.on.onViewResize = function() {
//					
//				};
			}
			break;
		case "window":
			iscontainer = 1;
			idoc = 1;
			prop.view = "window";
			prop.modal = typeof(component.modal) != "undefined" ? component.modal : true;
			prop.position = "center";
			prop.move = true;
			prop.resize = true;
			prop.autofocus = true;
			prop.autofit = false;
			// prop.hidden = true;
			break;
		case "treepanel":
			iscolumn = 1;
			idoc = 1;
			prop.type = (component.border ? "line" : "clear");
			prop.rows = [
				{
					type: "header",
					height: $s.__hh,
					css: "igc-wb-header",
                    padding: 0,
					hidden: !me._headerVisible(),
					template: component.title,
					borderless: true
				},
				{
					view: "layout",
					animate: false,
					rows: [
						{
							view: "treetable",
							_mx: 1,
							select: true,
							tooltip: true,
							multiselect: component.selModel && component.selModel.mode == "MULTI" ? true : false,
							padding: 0,
							margin: 0,
							columns: [],
							css: "igc-treeview",
							hover: "igc-grid-row-hover",
							dragscroll: true,
							borderless: (component.border ? false : true),
							header: component.hideHeaders ? false : true
						}
					]
				}
			];
			dprop = prop.rows[1];
			lprop = prop.rows[1].rows[0];
			eprop = lprop;
			break;
		case "gridpanel":
			iscolumn = 1;
			idoc = 1;
			prop.rows = [
				{
					type: "header",
					height: $s.__hh,
					css: "igc-wb-header",
                    padding: 0,
					hidden: !me._headerVisible(),
					template: component.title
				},
				{
					view: "layout",
					animate: false,
					flex: 1,
					rows: [
						{
							view: "datatable",
							_mx: 1,
							tooltip: true,
							resizeColumn: {
								size: 6,
								headerOnly: true
							},
							select: true,
							padding: 0,
							margin: 0,
							flex: 1,
							columns: [],
							hover: "igc-grid-row-hover",
							dragscroll: true,
							header: component.hideHeaders ? false : true
						}
					]
				}
			];
			
			dprop = prop.rows[1];
			lprop = prop.rows[1].rows[0];
			eprop = lprop;
			break;
		case "dataview":
			var dtemplate = "",
				tpl = component.tpl,
				n,
				n1, n2;
			
			if (tpl && tpl.length)
			{
				for (i=0;i<tpl.length;i++)
				{
					if (tpl[i].indexOf("<tpl") > -1 || tpl[i].indexOf("</tpl>") > -1)
					{
						tpl[i] = "";
					}
					else
					{
						n = tpl[i].indexOf("{");
				
						while (n > -1)
						{
							tpl[i] = tpl[i].substring(0, n) + "#" + tpl[i].substring(n+1);
							n1 = tpl[i].indexOf("{", n+1);
							n2 = tpl[i].indexOf("}", n+1);
							n = Math.min(n1 > -1 ? n1 : 99999, n2 > -1 ? n2 : 99999);
							if (n > 9999)
								break;
						}
					}
				}
				
				dtemplate = tpl.join("");
			}
			
			prop.rows = [
				{
					type: "header",
					height: $s.__hh,
					hidden: !me._headerVisible(),
					css: "igc-wb-header",
                    padding: 0,
					template: component.title
				},
				{
					view: "dataview",
					_mx: 1,
					select: true,
					template: dtemplate,
					padding: 0,
					margin: 0,
					columns: [],
					header: component.hideHeaders ? false : true,
					type: {
						width: 100,
						height: 100
					},
					on: {
						onSelectChange: function(ev) {
							var sel = this.getSelectedId(true),
								rec,
								__frec = component.__frec,
								rrec;
							
							if (sel && sel.length)
							{
								rec = Number(sel[0]);
								
								if (!__frec || (__frec && __frec.id != rec))
								{
									component.selModel.$f = rec;
									rrec = component.store._pull[rec];
									if (rrec)
									{
										component.selModel.select(rrec, true);
									}
								}
							}
						}
					}
				}
			];
			break;
		case "hiddenfield":
			prop.hidden = true;
		case "textfield":
			prop.view = "text";
			prop._mx = 1;
			isformfield = 1;
			prop.on = prop.on || {};
			if (component.enableKeyEvents)
			{
				prop.on.onKeyPress = function(code, e) {
					component.fireEvent.call(component, "keydown", component, e);
					component.fireEvent.call(component, "keypress", component, e);
					component.fireEvent.call(component, "keyup", component, e);
				};
			}
			
			if (component.inputType)
			{
				prop.type = component.inputType;
			}
			prop.value = component.value || "";
			prop.readonly = component.readOnly;
			break;
		case "numberfield":
			prop.view = "counter";
			prop._mx = 1;
			isformfield = 1;
			prop.step = component.step || 1;
			prop.min = component.minValue || 0;
			prop.max = component.maxValue || Number.MAX_VALUE;
			prop.readonly = component.readOnly;
			break;
		case "button":
		case "splitbutton":
			prop.view = "button";
			prop._mx = 1;
			prop.type = "htmlbutton";
			prop.borderless = true;
			if (component.iconCls)
			{
				prop.type = "iconButton";
				prop.icon = " icon-c-fix " + component.iconCls;
				
				if (component.text && !component.$w)
					prop.autowidth = true;
				else
					prop.width = component.$w || 30;
			}
			else
			{
				// prop.type = "form";
				if (component.$w)
				{
					prop.width = component.$w;
				}
				else
				{
					prop.autowidth = true;
				}
			}
			prop.tooltip = component.tooltip;
			prop.label = component.text || "";
			
			// prop.width = (!prop.label ? 30 : 120);
			
			prop.on = prop.on || {};
			
			if (component.border)
			{
				prop.borderless = false;
			}
			else
			{
				prop.borderless = true;
			}
			
			prop.on.onItemClick = function(e) {
				if (component.menu)
				{
					component._dMenu.call(component, component.menu);
				}
				
				if (component.$pm)
				{
					component.$pm.$dx.show(component.$dx.getNode());
				}
				
				if (component.handler)
				{
					component.handler.call(component.scope || component, e);
				}
			};
			
			if (component.cls)
			{
				prop.on.onAfterRender = function() {
					this.$view.className += " " + component.cls;
				};
			}
			break;
		case "toolbar":
			$s.apply(prop, {
				view: "toolbar",
				_mx: 1,
				elements: [],
				scroll: false,
				css: "pivot-toolbar-set"
			});
			break;
		case "html":
			prop.view = "template";
			prop._mx = 1;
			// prop.template = "";
			prop.template = component.html || "";
			prop.borderless = component.border == 0;
			
//			prop.on = prop.on || {};
//			prop.on.onAfterRender = webix.once(function() { 
//				setTimeout(function() {
//					var autoLoad = component.autoLoad;
//					
//					if (autoLoad && autoLoad.callback)
//					{
//						if (autoLoad.scope)
//						{
//							autoLoad.callback.apply(autoLoad.scope);
//						}
//						else
//						{
//							autoLoad.callback.apply(component);
//						}
//					}
//				}, 10);
//			});
			// prop.type = "clean";
			break;
		case "tabbar":
			prop.view = "tabbar";
			prop._mx = 1;
			prop.borderless = true;
			prop.optionWidth = 160;
			// prop.multiview = true;
			prop.options = [];
			prop.on = prop.on || {};
			prop.on.onBeforeTabClose = function(id, e) {
				component.removeTab.call(component, id);
			};
			prop.on.onChange = function(newv, oldv) {
				var sindex = 0,
					nv = parseInt(newv),
					i, items = component.tabPanel._items;
				
				// if (items.length == 0)
				// 	return;
					
				for (i=0; i < items.length; i++)
				{
					if (items[i].tab && items[i].tab.tabid == nv)
					{
						sindex = i;
						break;
					}
				}
					
				component.tabPanel.setActiveItem.call(component.tabPanel, sindex);
			};
			break;
		case "tabpanel":
			iscontainer = true;
			break;
		case "fieldset":
			prop.view = "fieldset";
			isformfield = 2;
			iscontainer = 1;
			prop.label = component.title;
			break;
		case "checkboxgroup":
			prop.view = "layout";
			isformfield = 2;
			iscontainer = 1;
			break;
		case "checkbox":
			prop.view = "checkbox";
			isformfield = 1;

			// prop.customCheckbox = true;
			if (component.boxLabel)
			{
				prop.labelRight = component.boxLabel;
			}
			
			prop.on = prop.on || {};
			prop.value = component.checked;
			prop.on.onChange = function(id, oid) {
				var nv = component.getValue(),
					ov = component.$value;
					
				if (nv !== ov)
				{
					component.fireEvent.call(component, "change", component, nv, ov);
					component.$value = nv;
				}
			};
			break;
		case "radiogroup":
			prop.view = "radio";
			// prop.customRadio = true;
			isformfield = 1;
			prop.vertical = component.vertical;
			prop.options = component.$options;
			prop.adjust = true;
			prop.name = component.name;
			prop.vertical = component.vertical;
			prop.on = prop.on || {};
			prop.on.onChange = function(sval, oval) {
				if (oval != sval)
				{
					var nvalue = component.getRadioGroupValue(sval),
						ovalue = component.$value;
					
					component.fireEvent.call(component, "change", component, nvalue, ovalue);
					component.$value = nvalue;
				}
			};
			break;
		case "combobox":
			prop.view = "combo";
			isformfield = 1;
			prop.options = [];
			
			prop.on = prop.on || {};
			
			prop.on.onChange = function(id, oid) {
				var nv = component.getComboValue(),
					ov = component.$value;
					
				if (nv !== ov)
				{
					component.fireEvent.call(component, "change", component, nv, ov);
					component.fireEvent.call(component, "select", component, nv, ov);
					component.$value = nv;
				}
			};
			
//			prop.on.onItemClick = function(id, e) {
//				// combo, records, eopts
//				component.fireEvent.call(component, "select", component, id, e);
//			};
			break;
		case "htmleditor":
			prop.view = "layout";
			prop._mx = 1;
			prop.rows = [
				{
					view: "toolbar",
					cols: [
						{
							view: "button",
							value: "Load",
							autowidth: true,
							on: {
								onItemClick: function(ev) {
									var req = new IG$/*mainapp*/._I3e/*requestServer*/(),
										obj = IG$/*mainapp*/._I2d/*getItemAddress*/({}),
										cnt = "<smsg><info option='downmark'><![CDATA[" + (me.sview[1].getValue() || "") + "]]></info></smsg>";
									
									req.init(me, 
										{
											ack: "11",
											payload: obj,
											mbody: cnt
										}, me, function(xdoc) {
											var tnode = IG$/*mainapp*/._I18/*XGetNode*/(xdoc, "/smsg/result"),
												mvalue = tnode ? IG$/*mainapp*/._I24/*getTextContent*/(tnode) : "";
												
											me.sview[2].setValue(mvalue);
											$("#m_preview", me.sview[3].$view).html(mvalue);
										});
									req._l/*request*/();
								}
							}
						}
					]
				},
				{
					view: "textarea",
					_h1: 1
				},
				{
					view: "resizer"
				},
				{
					view: "layout",
					cols: [
						{
							view: "template",
							_h1: 3,
							template: "<div id='m_preview' class='idv-pnl-html'></div>"
						},
						{
							view: "resizer"
						},
						{
							view: "textarea",
							readonly: true,
							_h1: 2
						}
					]
				}
			];
			break;
		case "textarea":
			prop.view = "textarea";
			isformfield = 1;
			prop.readonly = component.readOnly;
			break;
		case "colorpicker":
			prop.view = "button";
			prop.on = prop.on || {};
			prop.width = 18;
			prop.on.onItemClick = function(e) {
				if (!component._pui)
				{
					component._pui = webix.ui({
						view: "popup",
						width: 300,
						height: 300,
						// position: "center",
						body: {
							view: "colorboard",
							cols: 6,
							rows: 6,
							width: 500,
							height: 500,
							template: "<div class='value_cell'>" + 
								"<div>{obj.val}</div>" +
								"<div class='color_block' style='background:{obj.val};'></div>" +
								"</div>",
							on: {
								onSelect: function(value) {
									component._pui.close();
									component._pui = null;
									
									$("button", component.$dx.$view).css({backgroundColor: value});
									
									if (value.length > 1&& value.charAt(0) == '#')
									{
										value = value.substring(1);
									}
									
									component.fireEvent.call(component, "select", component, value);
								}
							}
						},
						on: {
							onHide: function() {
								if (component._pui)
									component._pui.close();
								component._pui = null;
							}
						}
					})
				}
				component._pui.show(component.$dx.$view, {pos: "bottom"});
			};
			// prop.view = "colorpicker";
			isformfield = 1;
			
			// if (component.hideInput)
			// {
			//	prop.labelWidth = 0;
			//	prop.inputWidth = 0;
			//	prop.css = "igc-colorpicker-button";
			// }
			break;
		case "datefield":
			prop.view = "datepicker";
			prop.timepicker = false;
			// prop.view = "button";
			prop.on = prop.on || {};
			/*
			prop.on.onItemClick = function(e) {
				if (!component._pui)
				{
					component._pui = webix.ui({
						view: "popup",
						width: 300,
						height: 300,
						body: {
							view: "datepicker",
							timepicker: false
						}
					});
				}
				component._pui.show(component.$dx.$view, {pos: "bottom"});
			};
			*/
			isformfield = 1;
			break;
		case "displayfield":
            prop.borderless = true;
		case "tbtext":
			prop.view = "label";
			prop.autowidth = prop.width ? false : true;
			isformfield = 1;
			prop.height = 26;
			prop.label = component.value || component.text;
            break;
		case "view":
			iscontainer = 1;
			break;
		case "dropzone":
			iscontainer = 1;
			break;
		case "spacer":
			prop.gravity = 1;
			prop.view = "spacer";
			prop._mx = 1;
			prop.borderless = true;
			prop.type = "clear";
			break;
		case "split":
		case "splitter":
		case "tbseparator":
		case "menuseparator":
			prop.$template = "Separator";
			prop._mx = 1;
			prop.width = 3;
			_sep = 1;
			break;
		case "fileuploadfield":
			prop.view = "layout";
			prop._mx = 1;
			isformfield = 1;
			prop.cols = [
				{
					view: "label",
					label: component.fieldLabel,
					width: component.labelWidth || 115,
					hidden: component.fieldLabel ? false : true
				},
				{
					view: "text",
					readonly: true,
					_t: "text"
				},
				{
					view: "uploader",
					_t: "button",
					value: component.buttonText || "Upload",
					multiple: false,
					autosend: false,
					autowidth: true,
					on: {
						onAfterFileAdd: function(item) {
							var dx = component.$dx,
								t_text,
								child,
								i;
							
							if (dx)
							{
								component._s = component._s || {};
								t_text = component._s["text"];
								if (!t_text)
								{
									child = dx.getChildViews();
									
									for (i=0; i < child.length; i++)
									{
										if (child[i].config._t)
										{
											component._s[child[i].config._t] = child[i];
										}
									}
									
									t_text = component._s["text"];
								}
								
								component.$$f = item.file;
								t_text.setValue(item.name);
							}
						}
					}
				}
			];
			break;
		default:
			throw "xtype error : " + component.xtype;
			break;
		}

		if (!_sep)
		{
			if (typeof(prop.borderless) == "undefined")
			{
				prop.borderless = false;
			}
			prop.margin = 0;
		}
		
		if (isformfield)
		{
			switch (component.xtype)
			{
			case "textfield":
				prop.label = prop.label || component.fieldLabel || "";
				break;
			default:
				prop.label = prop.label || component.fieldLabel || component.text || "";
				break;
			}
			
			if (!prop.label && (component.xtype == "button" || component.xtype == "displayfield") && component.value)
			{
				prop.label = component.value;
			}
			
			if (isformfield == 1)
			{
				prop._mx = 1;
				prop.disabled = component.disable;
			}
			if (prop.label)
			{
				prop.labelWidth = component.labelWidth || 115;
			}
			prop.borderless = true;
		}
		
		if ((isformfield == 1 || component.xtype == "button" || component.xtype == "splitbutton") && component.ownerCt && (component.ownerCt.layout.type == "hbox" || component.ownerCt.layout.type == "vbox"))
		{
			if (component.ownerCt.layout.align != "stretch" && !prop.width)
			{
				if (component.xtype == "combobox")
				{
					prop.width = 260;
					delete prop["autowidth"];
				}
				else if (component.xtype == "numberfield")
				{
					prop.width = 240;
					delete prop["autowidth"];
				}
				else if (component.xtype == "checkbox")
				{
					prop.width = 120;
					delete prop["autowidth"];
					if (!prop.label)
						prop.labelWidth = 20;
					else
						prop.width += 80;
				}
				else if (component.xtype == "colorpicker" && component.hideInput)
				{
					prop.width = 40;
					delete prop["label"];
				}
				else if (component.xtype == "textfield")
				{
					prop.width = 160;
					delete prop["autowidth"];
				}
				else
				{
					if (!component.flex)
					{
						prop.autowidth = true;
					}
					else
					{
						delete prop["autowidth"];
					}
				}
			}
		}
		
		if (iscontainer)
		{
			if (component.xtype == "viewport")
			{
				lprop = prop;
			}
			else if (prop.view == "window" || component._window)
			{
				prop.fitBiggest = false;
				prop.head = {
					view: "toolbar",
					borderless: false,
					cols: [
						{
							view: "label",
							label: component._getHeader()
						},
						{
							view: "button",
							icon: " icon-c-fix fa fa-times",
							type: "iconButton",
							width: 25,
							on: {
								onItemClick: function(ev) {
									component.close.call(component);
									// if (component.$ex)
									// {
										// component.$ex.close();
									// }
								}
							}
						}
					]
				};
				prop.body = {
					view: "layout",
					animate: false,
					padding: 0,
					margin: 0,
					rows: [
						{
							view: "layout",
							animate: false,
							borderless: false,
							padding: 0,
							margin: 0
						}
					]
				};
				
				lprop = prop.body.rows[0];
			}
			else if (component.xtype == "fieldset")
			{
				prop.adjust = true;
				
				prop.label = component.title || component.text || component.label || "";
				
				if (component.checkboxToggle)
				{
					prop.label = "<div><input type='checkbox' id='igc_fs_toggle' class='igc_btn_toggle'></input><span>" + prop.label + "</span></div>"
				}
				
				prop.body = {
					view: "layout",
					animate: false,
					padding: 0,
					margin: 0,
					borderless: true
				};
				lprop = prop.body;
			}
			else
			{
                prop.borderless = component.xtype == "fieldcontainer" || component.xtype == "container" || component.border === 0;

				prop.rows = [
					{
						type: "header",
						height: $s.__hh,
						css: "igc-" + component.xtype + " igc-wb-header",
						hidden: !me._headerVisible(),
						cols: [
							{
								view: "label",
								label: component._getHeader()
							}
						]
					},
					{
						view: "layout",
						adjust: true,
						animate: false,
                        css: "igc-" + component.xtype + " igc-wb-body",
						// borderless: prop.borderless === false ? true : false,
						padding: 0,
						margin: 0
					}
				];
				
				if (component.tools)
				{
					component._tools = [];
					
					$.each(component.tools, function(n, tool) {
						var icon = "",
							tb, ctb;
						
						switch (tool.type)
						{
						case "close":
							icon = "fa-times";
							break;
						case "refresh":
							icon = "fa-refresh";
							break;
						}
						
						ctb = new $s.button(tool);
						component._tools.push(ctb);
						
						tb = {
							view: "button",
							tooltip: tool.tooltip,
							hidden: tool.hidden,
							width: 26,
							_ts: n+1,
							on: {
								onItemClick: function() {
									if (tool.handler)
									{
										tool.handler.call(tool.scope || component);
									}
								}
							}
						};
						
						if (icon)
						{
							tb.type = "iconButton";
							tb.icon = " icon-c-fix fa " + icon;
						}
						
						prop.rows[0].cols.push(tb);
					});
				}
				
				lprop = prop.rows[1];
			}
		}
		else if (iscolumn)
		{
			if (component.enabledrag || component.enableDragDrop)
			{
				lprop.drag = true;
			}
			
			_t0 = component.viewConfig;
			
			if (_t0)
			{
				$.each(_t0, function(k, val) {
					if (!(k == "plugins" || k == "listeners"))
					{
						component[k] = val;
					}
				});
				
				if (_t0.plugins && _t0.plugins.ptype == "gridviewdragdrop")
				{
					lprop.drag = true;
					
					lprop.on = lprop.on || {};
					
					lprop.on.onBeforeDrop = function(context, ev) {
						var status = true,
							node,
							data,
							dropRec,
							dropPosition,
							dropFunction,
							dgrid,
							i,
							rec;
						
						data = component.$_dd = component.$_dd || {};
						
						data.view = context.from.$comp;
						data.records = [];
						
						for (i=0; i < context.source.length; i++)
						{
							rec = data.view.store._pull[context.source[i]];
							data.records.push(rec);
						}
						
						if (_t0.listeners && _t0.listeners.beforedrop)
						{
							_t0.panel = component;
							_t0.store = component.store;
							
							if (context.to)
							{
								dgrid = context.to.$comp;
								if (dgrid && context.target)
								{
									dropRec = dgrid.store._pull[context.target[0] || context.target.row];
								}
							}
							
							if (!dropRec && dgrid.store.data.items.length)
							{
								dropRec = dgrid.store.data.items[dgrid.store.data.items.length-1];
								dropPosition = "after";
							}
							// node, data, dropRec, dropPosition, dropFunction
							status = _t0.listeners.beforedrop.call(_t0, node, data, dropRec, dropPosition, dropFunction);
						}
						
						return status;
					}
					
					lprop.on.onAfterDrop = function(context, ev) {
						var node,
							data,
							dropRec,
							dropPosition,
							dropFunction,
							dgrid,
							i, j,
							rec,
							dstore;
						
						data = component.$_dd;
						
						if (!data) return;
						
						dstore = data.view.store;
						
						for (i=0; i < data.records.length; i++)
						{
							rec = data.records[i];
							
							if (data.copy == false)
							{
								delete dstore._pull[rec.data.id];
								
								for (j=0; j < dstore.data.items.length; j++)
								{
									if (dstore.data.items[j].data.id == rec.data.id)
									{
										dstore.data.items.splice(j, 1);
										break;
									}
								}
							}
						}
						
						if (context.to)
						{
							dgrid = context.to.$comp;
							if (dgrid)
							{
								if (context.target)
								{
									dropRec = dgrid.store._pull[context.target[0] || context.target.row];
								}
							}
							
							for (i=0; i < data.records.length; i++)
							{
								rec = data.records[i];
								dgrid.store._pull[rec.data.id] = rec;
								rec.store = dgrid.store;
								j = dgrid.store.indexOf(rec);
								dgrid.store.data.items.splice(j, 0, rec);
							}
						}
						
						if (!dropRec && dgrid.store.data.items.length)
						{
							dropRec = dgrid.store.data.items[dgrid.store.data.items.length-1];
							dropPosition = "after";
						}
						
						if (_t0.listeners && _t0.listeners.drop)
						{
							_t0.listeners.drop.call(_t0, node, data, dropRec, dropPosition);
						}
					}
				}
			}
			
			if (component.columns)
			{
				component.columns = component.configColumns.call(component, component.columns, lprop.columns, lprop);
				lprop.editable = component.editable;
				lprop.editaction = component.editaction;
			}
			
			lprop.on = lprop.on || {};
						
//			if (component._isAfterRender())
//			{
//				lprop.on.onAfterRender = webix.once(function() {
//					component._tafterrender.call(component);
//				});
//			}
			
			lprop.on.onBeforeOpen = function(id) {
				var rec = this.getItem(id),
					node,
					bload = 0,
					br,
					r;
				
				node = component.store._pull[id];
				
				if (rec.$count === -1)
				{
					bload = 1;
				}
				else if (rec.$count == 1 && node.childNodes[0].data._loading)
				{
					bload = 1;
				}
				
				if (bload)
				{
					if (component.store)
					{
						component.store._clearChild(node);
						delete rec._loading;
						
						r = component.fireEvent.call(component, "beforeitemexpand", node);
						
						if (r !== false)
						{
							if (component.store.proxy && component.store.proxy.type == "ajax")
							{
								component.store._loadNodeData.call(component.store, node);
							}
						}
					}
					
					rec.webix_kids = false;
					this.updateItem(id, rec);
				}
				else
				{
					r = component.fireEvent.call(component, "beforeitemexpand", node);
					if (r !== false)
					{
						component.fireEvent.call(component, "itemexpand", node);
					}
				}
				return true;
			};
			
			lprop.on.onAfterScroll = function() {
				if (component.afterScroll)
				{
					component.afterScroll.call(component);
				}
			};
			
			lprop.on.onItemClick = function(id, e, node) {
				clearTimeout(component.$Lc1);
				
				component.$Lc1 = setTimeout(function() {
					var c = -1,
						i,
						rec,
						rindex,
						n = 0;
						
					c = component.getColumnIndex(id);
					
					rindex = component.$dx.getIndexById(id.row);
					rec = component.store._pull[id.row];
					component.fireEvent.call(component, "itemclick", component, rec, node, rindex, e);
					// tobj, td, cellIndex, record, tr, rowIndex, e, eOpts
					component.fireEvent.call(component, "cellclick", component, node, c, rec, node, rindex, e);
					
					var s = component.getSelectionModel.call(component);
					
					if (s.checkSelector == "cell" && s.selType == "checkboxmodel")
					{
						s.select.call(s, rec, !rec.data.selected);
					}
					else if (s.selType != "checkboxmodel")
					{
						s.select.call(s, rec, true);
					}
				}, component.editable ? 300 : 0);
			};
			
			lprop.on.onItemDblClick = function(id, e, node) {
				clearTimeout(component.$Lc1);
				component.$dx.editCell(id.row, id.column, false, true);
				
				var c = -1,
					rec, rindex;

				c = component.getColumnIndex(id);
				rindex = component.$dx.getIndexById(id.row);
				rec = component.store._pull[id.row];
				component.fireEvent.call(component, "itemdblclick", component, rec, node, rindex, e);
			};
						
			lprop.on.onBeforeContextMenu = function(id, e, node) {
				var _listeners = component._listeners,
					r = true,
					rindex,
					i,
					c = -1,
					e, ev,
					beforeitemcontextmenu;
				
				if (_listeners.beforeitemcontextmenu)
				{
					beforeitemcontextmenu = _listeners.beforeitemcontextmenu[0];
					
					if (beforeitemcontextmenu)
					{
						// view, record, item, index, e
						rindex = component.$dx.getIndexById(id.row);
						
						c = component.getColumnIndex(id);
						
						rec = component.store._pull[id.row];
						ev = component._createEvent.call(component, "beforeitemcontextmenu", e);
						r = beforeitemcontextmenu.f.call(beforeitemcontextmenu.scope || component, component, rec, node, rindex, ev);
					}
				}
				
				return r;
			}
			
			lprop.on.onAfterEditStop = function(state, editor, ignoreUpdate) {
				if (state.value != state.old)
				{
					var record = component.store._pull[editor.row];
					
					record.data.edited = true;
					
					// webix.message("Cell value was changed");
					component.fireEvent.call(component, "edit", editor, {
						record: record
					});
				}
			}
			
			lprop.on.onSelectChange = function() {
				var grid = component.$dx,
					sel = grid.getSelectedId(true),
					rec,
					__frec = component.__frec,
					prec, srec,
					rrec;
				
				if (sel && sel.length)
				{
					rec = sel[0];
					
					if (!__frec || (__frec && __frec.id != rec.id))
					{
						component.selModel.$f = rec.id;
						rrec = component.store._pull[rec.row];
						if (rrec && component.selModel.selType != "checkboxmodel")
						{
							component.selModel.select(rrec, true);
						}
					}
				}
			}
			
			lprop.on.onCheck = function(row, column, state) {
				var grid = component.$dx,
					rec = component.store._pull[row],
					sm = component.getSelectionModel(),
					smode_multi = sm.mode == "MULTI",
					istree, i;
					
				if (rec)
				{
					if (component.xtype == "treepanel")
					{
						for (i=0; i < component.columns.length; i++)
						{
							if (component.columns[i].dataIndex == column && component.columns[i].xtype == "treecolumn")
							{
								istree = 1;
								break;
							}
						}
					}
					
					if (column == "selected" || istree)
					{
						if (!smode_multi && rec.data.selected)
						{
							rec.set("selected", true);
							rec.set("checked", true);
							return;
						}
							
						rec.set("selected", state ? true : false);
						rec.set("checked", state ? true : false);
						sm.select(rec, state);
					}
					else
					{
						rec.set(column, state ? true : false);
					}
					
					component.fireEvent.call(component, "checkchange", rec, state);
				}
			}
		}
		
		if (!_sep)
		{
			prop.padding = 0;
			prop.margin = 0;
			
			eprop.on = eprop.on || {};
			
			
			eprop.on.onViewResize = function(w, h) {
				// width, height, oldWidth, oldHeight
				me._vsize.call(me);
			};
			eprop.on.onLayoutResize = function() {
				me._vsize.call(me);
			};
			
			eprop.on.onResize = function() {
				me._vsize.call(me);
			};
		}
		
		if (iscontainer && component.xtype == "tabpanel")
		{
			lprop.rows = [
				{
					view: "tabbar",
					segmented: true,
					multiview: true,
					optionWidth: 120,
					_mt: 1,
					options: [],
					on: {
						onChange: function(newv, oldv) {
//							var o = component.$mt._tabs,
//								i,
//								atab;
//							
//							if (o)
//							{
//								for (i=0; i < o.length; i++)
//								{
//									if (o[i].id == newv)
//									{
//										o[i].$c.$ex.show();
//										break;
//									}
//								}
//							}

							var o = component.items.items,
								i,
								atab;
								
							for (i=0; i < o.length; i++)
							{
								if (o[i].tab && o[i].tab.tabid == newv)
								{
									o[i].$ex.show();
									break;
								}
							}
						}
					}
				},
				{
					view: "scrollview",
					scroll: "y",
					adjust: true,
					// height: 200,
					body: {
						rows: [
							{
								view: "multiview",
								_mx: 1,
								adjust: true,
								animate: false,
								fitBiggest: true,
								keepViews: true,
								padding: 0,
								margin: 0,
								cells: [
									$s.getBlank(false)
								]
							}
						]
					}
				}
			];
			
			vprop = lprop.rows[1].body.rows[0];
		}
		else if (iscontainer)
		{
			var vzone = null;
			
			switch (component.layout.type)
			{
			case "border":
				lprop._mx = 1;
                // lprop.borderless = true;
				lprop.rows = [
					{
						view: "layout",
						animate: false,
						adjust: true,
						padding: 0,
						_bd: 1,
						margin: 0,
						hidden: true,
                        borderless: true,
						rows: [
							$s.getBlank(true)
						]
					},
					{
						view: "layout",
						animate: false,
						adjust: true,
						_bd: 2,
						padding: 0,
						margin: 0,
                        borderless: true,
						cols: [
							$s.getBlank(false)
						]
					},
					{
						view: "layout",
						animate: false,
						adjust: true,
						_bd: 3,
						padding: 0,
						margin: 0,
						hidden: true,
                        borderless: true,
						rows: [
							$s.getBlank(true)
						]
					}
				];
				
				vzone = lprop;
				break;
			case "hbox":
				lprop.adjust = true;
                // lprop.borderless = true;
				lprop.rows = [
					{
						view: "layout",
						animate: false,
						adjust: true,
						_mx: 1,
						padding: 0,
						margin: 0,
                        borderless: true,
						cols: [
							$s.getBlank(false)
						]
					}
				];
				break;
				vzone = lprop.rows[1];
			case "vbox":
			case "anchor":
                lprop.borderless = true;
				lprop.rows = [
					{
						view: "layout",
						animate: false,
						adjust: true,
						_mx: 1,
						padding: 0,
                        borderless: true,
						margin: 0,
						rows: [
							$s.getBlank(false)
						]
					}
				];
				
				if (component.autoScroll)
				{
					lprop.rows[0].view = "scrollview";
					lprop.rows[0].scroll = "y";
					
					delete lprop.rows[0]["rows"];
					delete lprop.rows[0]["_mx"];
					
					lprop.rows[0].body = {
						_mx: 1,
						padding: 0,
						margin: 0,
                        borderless: true,
						rows: [
							$s.getBlank(false)
						]
					};
					vprop = lprop.rows[0].body;
				}
				else
				{
					vprop = lprop.rows[0];
				}
				break;
			case "fit":
			case "card":
				lprop.rows = [
					{
						view: "multiview",
						// view: "layout",
						_mx: 1,
						animate: false,
                        borderless: true,
						fitBiggest: true, // component.layout.type == "fit" ? false : true,
						keepViews: true,
						adjust: true,
						padding: 0,
						margin: 0,
						cells: [
							$s.getBlank()
						]
					}
				];
				vprop = lprop.rows[1];
				break;
			case "accordion":
				lprop.rows = [
					{
						view: "accordion",
						type: "head",
                        borderless: true,
						_mx: 1,
						rows: [
							$s.getBlank(false)
						]
					}
				];
				vprop = lprop.rows[0];
				break;
			default:
				throw "layout type error : " + component.xtype;
				break;
			}
		}
		
		if (iscontainer)
		{
			if (vprop)
			{
				if (component.bodyPadding || component.padding)
				{
					var p = component.bodyPadding || component.padding,
						t = typeof(p);
					
					if (t == "string")
					{
						t = p.split(" ");
						vprop.padding = Number(t[0]) || 0;
					}
					else
					{
						vprop.padding = p;
					}
				}
				else if (component.bodyStyle)
				{
					var bs = component.bodyStyle.split(";");
					$.each(bs, function(i, s) {
						var n = s.split(":");
						if (n[0] == "padding")
						{
							if (n[1].substring(n[1].length-2) == "px")
							{
								n[1] = n[1].substring(0, n[1].length-2);
							}
							vprop.padding = Number(n[1]);
						}
					});
				}
			}
		}

		if (component.xtype == "checkboxgroup" || component.xtype == "fieldcontainer")
		{
			if (component.fieldLabel)
			{
				var p = (component.layout.type == "vbox" || component.layout.type == "anchor" ? lprop.rows[0].rows : lprop.rows[0].cols);
				
				p.push({
					view: "label",
					width: component.labelWidth || 115,
					label: component.fieldLabel
				});
			}
		}
		
		if (idoc)
		{
			lprop = dprop || lprop;
			lprop.rows.splice(0, 0, {
				view: "layout",
				animate: false,
				_d1: 1,
				hidden: true,
				autowidth: false,
				padding: 0,
				margin: 0,
                borderless: true,
				rows: [
					$s.getBlank(true)
				]
			});
			
			lprop.rows.splice(lprop.rows.length, 0, {
				view: "layout",
				animate: false,
				_d2: 1,
				hidden: true,
				autowidth: false,
				padding: 0,
				margin: 0,
                borderless: true,
				rows: [
					$s.getBlank(true)
				]
			})
		}
		
		if (!_sep && !lprop.rows && !lprop.cols && !lprop.cells)
		{
			lprop.rows = [
				$s.getBlank(true)
			];
		}
		
		return prop;
	},
	
	configColumns: function(columns, ncolumns, lprop) {
		var component = this,
			newcols = [],
			nc;
		
		component.$7f = 0;
		
		if (component.selModel.selType == "checkboxmodel" && columns.length)
		{
			//if (!columns[0].$cm)
			// {
				nc = {
					xtype: "checkcolumn",
					text: "",
					$cm: 1,
					dataIndex: "selected",
					width: 40
				};
				
				// columns.splice(0, 0, );
				component.$7f = 1;
			// }
		}
		
		var pc = function(i, c) {
			c.dataIndex = c.dataIndex || "__dc" + i;
			var nc = new $s.column(c),
				tpl,
				combo_store;
			
			if (!c.$cm)
				newcols.push(nc);
			
			if (c.dataIndex == "selected" && c.xtype == "checkcolumn" && !component.selModel.mode)
			{
				component.selModel.mode = "MULTI";
			}
			
			var p = {
				header: c.text || c.header || "",
				id: c.dataIndex
			};
			
			if (c.width)
			{
				p.width = c.width;
			}
			else if (c.minWidth)
			{
				p.minWidth = c.minWidth;
				p.fillspace = c.flex || 1;
			}
			else
			{
				p.fillspace = c.flex || 1;
			}
			
			if (c.hidden)
			{
				p.hidden = true;
			}
			
			if (c.xtype == "checkcolumn")
			{
				p.editor = "checkbox";
				// p.template = "{common.checkbox()}";
				p.template = function(obj, common) {
					var config = {
						checkValue: 1
					};
					
					return common.checkbox(obj, common, (c.dataIndex == "selected" ? obj.selected || obj.checked : false) || obj[c.dataIndex] ? 1 : 0, config);
				};
				
				if (component.selModel.mode == "MULTI")
				{
					p.header = {
						title: p.header,
						content: "masterCheckbox"
					};
					/*
					p.header = "<span style='igc-tb-hd-chkb'><input type='checkbox' name='ig-chk-all'></input>" + p.header + "</span>";
					lprop.on = lprop.on || {};
					lprop.on.onHeaderClick = function(id, e, node) {
						var chkbtn = $("[name=ig-chk-all]", node);
						
						if (chkbtn.length)
						{
							// delayed execution after value updated
							setTimeout(function() {
								var checked = chkbtn.attr("checked");
								
								
							}, 10);
						}
					}
					*/
				}
			}
			else if (c.xtype == "treecolumn")
			{
				p.template = function(obj, common){
					var config = {
							checkValue: 1
						},
						hidden = typeof(obj.checked) == "undefined";
						
			    	return common.treetable(obj, common) + 
			    		(hidden ? "" : common.checkbox(obj, common, obj.selected || obj.checked ? 1 : 0, config)) +
			    		// common.icon(obj, common) +
			    		" " + obj[c.dataIndex];
			  	};
				// p.template = "{common.treetable()} #" + c.dataIndex + "#";
			}
			else if (c.xtype == "templatecolumn")
			{
				tpl = c.tpl || "";
				// <div class='ig-navi-itemicon {iconcls}'></div><span class='ig-navi-text' title='{name} ({type})'>{name}</span>
				tpl = tpl.replace(/\{|\}/g, "#");
				                  //\[|\]/g
				p.template = tpl;
				
				p.sort = "string";
			}
			else if (c.xtype == "actioncolumn")
			{
				p.css = "igc-actioncolumn";
				p.template = "";
				lprop.onClick = lprop.onClick || {};
				
				$.each(c.items, function(k, pitem) {
					p.template += "<div class='actionitem_" + k + " igc-actionitem " + pitem.iconCls + "' ></div>";
					lprop.onClick["actionitem_" + k] = function(event, id, node) {
						// webix.message(pitem.iconCls + event + ',' + id +',' + node);
						if (pitem.handler)
						{
							// grid, rowIndex, colIndex
							var rowindex = component.$dx.getIndexById(id),
								colindex = i,
                                item, 
                                record = component.store._pull[id.row];
							pitem.handler.call(pitem.scope || component, component, rowindex, colindex, item, event, record);
						}
						return false;
					};
				});
			}
			else
			{
				p.sort = "string";
			}
			
			if (c.tdCls)
			{
				p.css = c.tdCls;
			}
			
			if (c.renderer)
			{
				// value, metadata, record
				p.template = function(data, common, text, val) {
					var record = component.store._pull[data.id],
						metadata = null,
						rowindex = null,
						colindex = null,
						store = component.store;
					
					if (!record)
					{
						record = new $s.record(data, store);
					}	
					
					text = c.renderer.call(component, text, metadata, record, rowindex, colindex, store);
					if (c.xtype == "treecolumn")
					{
						text = common.treetable(data, common) + text
					}
					return text;
				}
			}
			
			if (c.editor)
			{
				if (c.editor.xtype == "combobox")
				{
					c.editor.type = "select";
				}
				p.editor = c.editor.type || "text";
				component.editable = true;
				component.editaction = "custom";
				p.editAction = "custom";
				lprop.editable = true;
				
				if (p.editor == "select" || p.editor == "combo")
				{
					combo_store = c.editor.store;
					c.editor._store = combo_store;
					if (combo_store)
					{
						c.editor.store = component.createClassComp(combo_store);
					}
					else
					{
						c.editor.store = null;
					}
					p.options = [];
					
					var clfield = c.editor.displayField,
						vlfield = c.editor.valueField;
						
					if (c.editor.store)
					{
						$.each(c.editor.store.$data, function(i, rec) {
							p.options.push({
								id: rec[vlfield],
								value: rec[clfield]
							});
						});
					}
				}
			}
			
			ncolumns.push(p);
			
			nc.$col = p;
			nc.$g = component;
		};
		
		if (nc)
		{
			pc(0, nc);
		}
		
		$.each(columns, pc);
		
		return newcols;
	},
	
	_headerVisible: function() {
		var me = this,
			r = false;
		
		if (me.title && me.header !== false)
		{
			r = true;
			
			if (me.ownerCt && (me.ownerCt.xtype == "tabpanel" || me.ownerCt.tabBar))
			{
				r = false;
			}
		}
		
		return r;
	},
	
	_tafterrender: function() {
		var component = this;

		if (component.xtype == "combobox")
		{
			if (component.store.$data)
			{
				component.store.loadData(component.store.$data);
			}
		}
		// setTimeout(function() {
			component.rendered = 1;
			component.fireEvent.call(component, "afterrender", component);
			component._vsize.call(component, 1, 1);
			
			if (component.ownerCt && component.ownerCt.onAdd)
			{
				component.ownerCt.onAdd.call(component.ownerCt, component, component.ownerCt._items.lengt-1);
			}
		// }, 1);
	},
	
	_getHeader: function() {
		var component = this;
		return component.title;
	},
	
	_vsize: function(propagation, onrender, forced) {
		var me = this,
			dx = me.$dx,
			nw, nh;
			
		if (dx && me.rendered && !me.hidden)
		{
			nw = dx.$width;
			nh = dx.$height;
			
			if (me.$width != nw || me.$height != nh || onrender)
			{
				me.fireEvent("resize", me, nw, nh, me.$width, me.$height);
				me.$width = nw;
				me.$height = nh;
			}
			
			if (!propagation || forced)
			{
				$.each(me._items, function(i, item) {
					item._vsize.call(item, propagation, onrender, forced);
				});
			}
		}
	},
	
	addViewItem: function(component, parent, isdock, _pdc) {
		var me = this,
			dx = parent ? parent.$dx : null,
			cview, views, tview,
			prop,
			cdx, 
			sdx,
			cindex = 0,
			index = 0, sindex,
			iscard = parent ? (parent.layout.type == "card" || parent.xtype == "tab") : false,
			pitem, citem,
			i,
			iswindow = component.xtype == "window",
			_items = parent ? parent._items : null,
			d_render = 0;
			
		if (isdock)
		{
			if (!_pdc)
			{
				_pdc = parent["$dc" + (component.dock == "top" ? 1 : 2)];
			}
			
			dx = _pdc;
			cview = dx;
		}
		
		if (!component.$dx)
		{
			prop = component.updateViewProp.call(component, component);
		}
		
		if (isdock && _pdc)
		{
			_pdc.show();
		}
		else if (dx)
		{
			for (i=0; i < _items.length; i++)
			{
				if (_items[i] == component)
				{
					cindex = i;
					break;
				}
			}
						
			if (dx.getChildViews)
			{
				views = dx.getChildViews();
					
				cview = dx;
				
//				if (views && views.length)
//				{
//					for (i=0; i < views.length; i++)
//					{
//						if (views[i].config.type == "header")
//						{
//							cview = views[i+1];
//							views = cview.getChildViews();
//							break;
//						}
//					}
//				}
				
				switch (parent.layout.type)
				{
				case "fit":
				case "card":
                    prop.borderless = true;
					for (i=_items.length-1; i>=0; i--)
					{
						// cview.removeView(views[i]);
						if (parent.layout.type == "card" && parent.selectedIndex == i)
						{
							_items[i].show(true);
						}
						else if (parent.layout.type == "card")
						{
							// _items[i].hide();
						}
					}
					index = -1;
					break;
				case "accordion":
					index = _items.length;
					break;
				case "border":
					bs = 0;
					
					switch (component.region)
					{
					case "center":
						cview = parent.layout.$r2;
						break;
					case "west":
						cview = parent.layout.$r2;
						break;
					case "east":
						cview = parent.layout.$r2;
						break;
					case "north":
						cview = parent.layout.$r1;
						break;
					case "south":
						cview = parent.layout.$r3;
						break;
					}
					
					for (i=0; i < parent._items.length; i++)
					{
						pitem = parent._items[i];
						
						if (pitem == component)
						{
						}
						else if (pitem.$ex)
						{
							sindex = cview.index(pitem.$ex);
							
							if (component.region == pitem.region)
							{
								index = Math.max(sindex + 1, index);
							}
							else if (component.region == "west" && (pitem.region == "center" || pitem.region == "east"))
							{
								index = Math.min(sindex, index);
							}
							else if (component.region == "east" && (pitem.region == "center" || pitem.region == "west"))
							{
								index = Math.max(sindex + 1, index);
							}
							else if (component.region == "center" && pitem.region == "east")
							{
								index = Math.min(sindex, index);
							}
							else if (component.region == "center" && pitem.region == "west")
							{
								index = Math.max(sindex + 1, index);
							}
						}
					}
					
					if (cview)
					{
						cview.show();
					}
					break;
				case "vbox":
				case "anchor":
				case "hbox":
					index = views.length;
					break;
				}
			}
		}
				
		if (cview && cview.addView && component.$dx && component.$dx.getParentView && component.$dx.getParentView() != cview)
		{
			if (!isdock)
			{
				cview.addView(component.$dx, index);
			}
			else
			{
				dview.addView(component.$dx);
			}
			component.$cx = cview;
		}
		else if (cview && cview.addView && prop)
		{
			d_render = 1;
			if (index > -1 && !isdock)
			{
				cdx = cview.addView(prop, index);
			}
			else
			{
				cdx = cview.addView(prop);
			}
			component.$cx = cview;
		}
		else if (iswindow)
		{
			cdx = webix.ui(prop);
		}
		
		if (cdx && typeof cdx == "string")
		{
			cdx = $$(cdx);
		}
		
		if (cview && !isdock)
		{
			var sview = cview.getChildViews();
			
			if (sview && sview.length)
			{
				for (i=sview.length-1;i>=0; i--)
				{
					if ((parent.layout.type == "card" || parent.layout.type == "fit"))
					{
						if (sview[0].config._mblank)
						{
							// cview.hide();
						}
					}
					else if (sview[i].config._mblank)
					{
						cview.removeView(sview[i]);
						// sview[i].$setSize(0,0);
					}
				}
			}
		}
		
		component._postAddView(component, cdx, parent, d_render, dx, isdock, iscard, cindex, cview);
	},
	
	_postAddView: function(component, cdx, parent, d_render, dx, isdock, iscard, cindex, cview) {
		if (cdx)
		{
			component.$ex = cdx;
			component.$dx = cdx;
			component.$dx.$comp = component;
			
			component.updateViewElement(cdx);
			
			if (isdock)
			{
				cview.show();
			}
			else
			{
				if (parent && (parent.layout.type == "card" || parent.xtype == "tabpanel"))
				{
					parent.selectedIndex = parent.selectedIndex || 0;
					
					for (i=parent._items.length-1;i>=0;i--)
					{
						if (parent.selectedIndex == i)
						{
							parent._items[i].show(true);
							break;
						}
					}
				}
				else if (iscard && component.$ex)
				{
					if (cindex == component.ownerCt.selectedIndex)
					{
						component.show(true);
					}
					else
					{
						// component.hide();
					}
				}
				else if (parent && parent.layout.type == "fit" && !component.hidden)
				{
					component.show(true);
				}
			}
		}
		
		if (cdx)
		{
			if (component._items && component._items.length)
			{
				if (component.xtype == "tabpanel" || component.layout.type == "card")
				{
					component.selectedIndex = component.selectedIndex || 0;
				}
				
				$.each(component._items, function(i, item) {
					if (item.ownerCt)
					{
						item.addViewItem.call(item, item, item.ownerCt);
					}
				});
			}
			
			if (component.xtype == "fieldset")
			{
				component.checkboxCmp = $("#igc_fs_toggle", cdx.$view);
				component.checkboxCmp.getValue = function() {
					return this.is(":checked");
				};
				component.checkboxCmp.setValue = function(val) {
					if (val)
						this.attr("checked", "checked");
					else
						this.removeAttr("checked");
				}
			}
			
			if ((component.xtype == "window" || component.xtype == "panel" || component.xtype == "gridpanel" || component.xtype == "treepanel" || component.xtype == "fieldset") && component._dockedItems && component._dockedItems.length)
			{
				$.each(component._dockedItems, function(i, item) {
					if (item.ownerCt)
					{
						item.addViewItem.call(item, item, item.ownerCt, 1);
					}
				});
			}
		}

		if (d_render)
		{
			component.body.updateDom.call(component.body);
			component.el.updateDom.call(component.el);
			
			if (component.xtype == "html" && component.html)
			{
				$(component.body.dom).empty();
				$(component.body.dom).append(component.html);
			}
			else if (component.xtype == "textarea")
			{
				var vdom = $("textarea", component.body.dom);
				
				if (vdom.length)
				{
					component.inputEl.dom = vdom[0];
				}
			}
		}
				
		if (cdx)
		{
			component.postAddViewItem.call(component);
			// cdx.adjust && cdx.adjust();
		}
		
		if (dx)
		{
			if (parent.layout.type == "border")
			{
				parent.updateBorderRegion.call(parent);
			}
						
			if (component.xtype == "fieldcontainer") // || component.xtype == "fieldset") || component.xtype == "radiogroup")
				dx.adjust();
			// if (!component._window)
			//	dx.adjust && dx.adjust();
			
			if (component.layout.type == "border")
			{
				var i, j,
					citem,
					sindex,
					c,
					ms = 0,
					sp = {
						view: "resizer",
						borderless: false
					},
					seq = {
						"north": 0,
						"west": 1,
						"center": 2,
						"east": 3,
						"south": 4
					};
					
				component._items.sort(function(a, b) {
					var r = 0,
						s1, s2;
					if (a.region != b.region)
					{
						s1 = seq[a.region];
						s2 = seq[b.region];
						
						r = (s1 - s2);
					}
					return r;
				});
					
				for (i=component._items.length-1; i>=0; i--)
				{
					citem = component._items[i];
					if (citem.$cx && citem.split == true && !citem.$sx)
					{
						mlist = citem.$cx.getChildViews();
						c = 0;
						for (j=0; j < mlist.length; j++)
						{
							if (mlist[j].isVisible())
							{
								c++;
							}
						}
						
						sindex = citem.$cx.index(citem.$ex);
						
						if (mlist.length > 1 && sindex < mlist.length - 1 && !citem.hidden)
						{
							sp.ownerCt = citem.$cx;
							sp.hidden = (c > 1 || !citem.hidden ? false : true);
							citem.$sx = citem.$cx.addView(sp, sindex+1);
							
							if (typeof(citem.$sx) == "string")
							{
								citem.$sx = $$(citem.$sx);
							}
						}
					}
				}
			}
		}
	},
	
	updateBorderRegion: function() {
		var me = this,
			layout = me.layout,
			r1 = layout.$r1,
			r2 = layout.$r2,
			r3 = layout.$r3,
			v1, v2 = 1, v3,
			_items = me._items,
			i;
		
		if (r1 && r3)
		{
			for (i=0; i < _items.length; i++)
			{
				if (!_items[i].hidden)
				{
					switch (_items[i].region)
					{
					case "north":
						v1 = 1;
						break;
					case "south":
						v3 = 1;
						break;
					}
				}
			}
			
			r1[v1 ? "show" : "hide"]();
			r3[v3 ? "show" : "hide"]();
		}
	},
	
	_loopCDX: function(cdx) {
		var me = this,
			views,
			r, t, sr,
			i;
		
		views = cdx.getChildViews ? cdx.getChildViews() : null;
		
		if (views && views.length)
		{
			for (i=0; i < views.length; i++)
			{
				if (views[i].config._d1)
				{
					me.$dc1 = views[i];
				}
				
				if (views[i].config._d2)
				{
					me.$dc2 = views[i];
				}
				
				if (views[i].config._mt)
				{
					me.$mt = views[i];
				}
				
				if (views[i].config._mx)
				{
					r = views[i];
					
					if (me.layout.type == "border")
					{
						me._loopCDX(r);
					}
				}
				else if (views[i].config._ts)
				{
					me._tools[views[i].config._ts - 1].$dx = views[i];
				}
				else
				{
					sr = me._loopCDX(views[i]);
					
					if (sr)
					{
						r = sr;
						break;
					}
				}
			}
		}
		
		return r;
	},

	updateViewElement: function(cdx) {
		var component = this,
			tview,
			views,
			ct = component.type,
			l = component.layout,
			lt = l ? l.type : null,
			tlayer = (lt == "hbox" || lt == "fit" || lt == "card"),
			_mx,
			i, j, t;
		
		views = cdx.getChildViews ? cdx.getChildViews() : null;
		
		if (ct == "window" || ct == "fieldset" || component._window)
		{
			cdx = cdx.getBody();
			// views = component.$bx.getChildViews();
		}

		if (cdx.config._mx)
		{
			_mx = cdx;
		}
		else
		{
			t = component._loopCDX(cdx);
			
			if (t)
			{
				_mx = t;
			}
		}
				
		if (!_mx)
			throw "error on view element";
			
		component.$dx = _mx;
		component.$dx.$comp = component;
		
		if (views && views.length)
		{
			if (views[0].config.type == "header")
			{
				component.$tx = views[0];
			}
		}
		
		if (component.layout)
		{
			if (component.layout.type == "border")
			{
				views = _mx.getChildViews();
				
				for (i=0; i < views.length; i++)
				{
					if (views[i].config._bd)
					{
						component.layout["$r" + views[i].config._bd] = views[i];
					}
				}
			}
		}
		
		if (component.xtype == "htmleditor")
		{
			views = _mx.getChildViews();
			
			component.sview = {};
			
			for (i=0; i < views.length; i++)
			{
				if (views[i].config._h1)
				{
					component.sview[views[i].config._h1] = views[i];
				}
				else if (views[i].getChildViews)
				{
					var sviews = views[i].getChildViews();
					
					for (j=0; j < sviews.length; j++)
					{
						if (sviews[j].config._h1)
						{
							component.sview[sviews[j].config._h1] = sviews[j];
						}
					}
				}
			}
		}
	},
	
	postAddViewItem: function() {
		var me = this,
			cdx = me.$dx,
			autoLoad;
		
		switch (me.xtype)
		{
		case "html":
			autoLoad = me.autoLoad;
			if (autoLoad && autoLoad.url)
			{
				$.ajax({
					type: "GET",
					url: autoLoad.url + "?uniquekey=" + IG$/*mainapp*/._I4a/*getUniqueKey*/(), 
					dataType: "text",
					timeout: 10000,
					success: function(data) {
						if (cdx)
						{
							// cdx.setHTML(data);
							var dom = $(cdx.$view);
							dom.empty();
							dom.append(data);
						}
						
						if (autoLoad.callback)
						{
							if (autoLoad.scope)
							{
								autoLoad.callback.apply(autoLoad.scope);
							}
							else
							{
								autoLoad.callback.apply(me);
							}
						}
					},
					error: function(e, status, thrown) {
					}
				});
			}
			break;
		case "window":
			me.hide(true);
			break;
		}
		
		// if (!me._isAfterRender())
			me._tafterrender();
	},
	
	_isAfterRender: function() {
		return /(gridpanel|html)/.test(this.xtype);
	},
	
	down: function(skey) {
		var me = this,
			i,
			r,
			sm;
			
		if (skey[0] == '[' && skey[skey.length-1] == ']')
		{
			skey = skey.substring(1, skey.length - 1);
			sm = skey.split("=");
			skey = sm[1];
		}
		
		if (me._dockedItems && me._dockedItems.length)
		{
			for (i=0; i < me._dockedItems.length; i++)
			{
				if (me._dockedItems[i].name == skey)
				{
					r = me._dockedItems[i];
					break;
				}
			}
			
			if (!r)
			{
				for (i=0; i < me._dockedItems.length; i++)
				{
					r = me._dockedItems[i].down.call(me._dockedItems[i], skey);
					
					if (r)
					{
						break;
					}
				}
			}
		}
		
		if (!r && me._tools)
		{
			for (i=0; i < me._tools.length; i++)
			{
				if (me._tools[i].name == skey)
				{
					r = me._tools[i];
					break;
				}
			}
		}
		
		if (!r && me.menu && me.menu._items)
		{
			for (i=0; i < me.menu._items.length; i++)
			{
				if (me.menu._items[i].name == skey)
				{
					r = me.menu._items[i];
					break;
				}
			}
		}
		
		if (!r && me._items && me._items.length)
		{
			for (i=0; i < me._items.length; i++)
			{
				if (me._items[i].name == skey)
				{
					r = me._items[i];
					break;
				}
			}
			
			if (!r)
			{
				for (i=0; i < me._items.length; i++)
				{
					r = me._items[i].down.call(me._items[i], skey);
					
					if (r)
					{
						break;
					}
				}
			}
		}
		
		if (!r && me.columns && me.columns.length)
		{
			for (i=0; i < me.columns.length; i++)
			{
				if (me.columns[i].name == skey)
				{
					r = me.columns[i];
					break;
				}
			}
		}
		
		if (!r && me.xtype == "radiogroup" && me.$options)
		{
			for (i=0; i < me.$options.length; i++)
			{
				if (me.$options[i].name == skey)
				{
					r = me;
					break;
				}
			}
		}
		
		return r;
	},
	
	/****************** treestore ************************/
	getRootNode: function() {
		var me = this,
			store = me.store,
			rootnode;
			
		if (store)
		{
			rootnode = store.getRootNode();
		}
		
		return rootnode;
	},
	
	setRootNode: function(node) {
		return this.store.setRootNode.call(this.store, node);
	},
	
	reconfigure: function(store, columns) {
		var component = this,
			dx = component.$dx,
			ncolumns = [],
			istore;
		
		if (component.store)
		{
			$s.apply(component.store, store);
		}
		else
		{
			component._store = store;
			store.xtype = store.xtype || "store";
			store.grid = component;
			component.store = component.createClassComp(store);
		}
		
		$s.apply(store, component.store);
		
		component.columns = component.configColumns.call(component, columns, ncolumns);
		
		dx.config.columns = ncolumns;
		
		dx.refreshColumns();
		
		component.store.loadData.call(component.store, component.store.$data);
	},
	
	/******************* layouter *************************/
	getLayout: function() {
		return this;
	},
	
	/****** extension for webiz *****/
    getComponent: function(cid) {
    	var me = this,
    		i,
    		c,
    		items = me._items;
    		
    	for (i=0; i < items.length; i++)
    	{
    		if (items[i].id == cid)
    		{
    			c = items[i];
    			break;
    		}
    	}
    	
    	return c;
    },
    
    setActiveItem: function(item) {
    	var me = this,
    		n = item,
    		pindex,
    		i;
    		
    	if (typeof(item) == "object")
    	{
    		n = 0;
    		
    		for (i=0; i < me._items.length; i++)
    		{
    			if (me._items[i] == item)
    			{
    				n = i;
    				break;
    			}
    		}
    	}
    	
    	pindex = me.selectedIndex || 0;
    	
    	if (pindex == n)
    		return;
    	
    	me.selectedIndex = n;
    	
    	me._items[me.selectedIndex].show();
    },
    
    getActiveItem: function() {
    	var me = this,
    		n = me._items[me.selectedIndex];
    	
    	return n;
    },
    
    getTabBar: function() {
    	return this.tabBar;
    }
});

$s.tabbar = $s.extend($s.base, {
	xtype: "tabbar",
	validate: function() {
		var me = this,
			panel = me.tabPanel,
			i, j,
			dx = me.$dx,
			opt;
			
		if (panel && dx)
		{
			me.$tid = me.$tid || 0;
			
			for (i=0; i < panel._items.length; i++)
			{
				if (panel._items[i].$ex)
				{
					opt = { 
						name: panel._items[i].title,
						value : "<span>" + panel._items[i].title + "</span>", 
						close: true
					};
					
					if (panel._items[i].iconCls)
					{
						// opt.icon = " icon-c-fix " + panel._items[i].iconCls;
						opt.value = "<div class='igc-tab-label'><span class='webix_icon icon-c-fix " + panel._items[i].iconCls + "'></span><span class='igc-tab-text'>" + panel._items[i].title + "</span></div>"
					}
						
					if (!panel._items[i].tab)
					{
						opt.id = me.$tid++;
						panel._items[i].tab = new $s.tabbutton({
							tabbar: me,
							ownerCt: panel._items[i],
							tabid: opt.id
						});
						dx.addOption(opt, true);
					}
					else
					{
						for (j=0; j < dx.data.options.length; j++)
						{
							if (dx.data.options[j].id == panel._items[i].tab.tabid)
							{
								dx.data.options[j].value = opt.value;
								break;
							}
						}
					}
				}
			}
			
			dx.refresh();
		}
	},
	setActiveTab: function(card) {
		var me = this,
			mt = me.$dx;
		
		if (mt && card.tab)
		{
			mt.setValue("" + card.tab.tabid);
		}
	},
	removeTab: function(id) {
		var me = this,
			i, sid = parseInt(id),
			panel = me.tabPanel,
			items = panel._items,
			item;
			
		for (i=0; i < items.length; i++)
		{
			if (items[i].tab && items[i].tab.tabid == sid)
			{
				item = items[i];
				break;
			}
		}
		
		if (item)
		{
			var r = item.fireEvent.call(item, "beforeclose", item);
			
			if (r === false)
				return;
			
			panel.onRemove.call(panel, item, true);
			item.fireEvent.call(item, "close", item);
		}
	}
});

$s.panel = $s.extend($s.base, {xtype: "panel"});
$s.tabpanel = $s.extend($s.base, {
	xtype: "tabpanel",
	
	setActiveTab: function(card) {
		var me = this,
			tabBar = me.tabBar;
		
		if (tabBar)
		{
			tabBar.setActiveTab.call(tabBar, card);
		}
	}
});

$s.window = $s.extend($s.base, {
	xtype: "window",
	isWindow: true
});

$s.container = $s.extend($s.base, {xtype: "container"});

$s.treepanel = $s.extend($s.base, {xtype: "treepanel"});
$s.treestore = $s.extend($s.dstore, {xtype: "treestore"});
$s.reader = $s.extend($s.base, {xtype: "reader"});

$s.formpanel = $s.extend($s.base, {
	xtype: "formpanel",
	getForm: function() {
		return this;
	},
	isValid: function() {
		var me = this,
			view = me.$ex,
			items = me.items,
			isvalid = true,
			i, item,
			v;
			
		for (i=0; i < items.items.length; i++)
		{
			item = items.items[i];
			
			v = item.isvalid();
			if (v == false)
			{
				isvalid = false;
			}
		}
			
		return isvalid;
	},
	submit: function(opt) {
		var me = this,
			view = me.$ex,
			values = new FormData();
			
		me.getValues(values);
		
		$.ajax({
			url: opt.url,
			type: "POST",
			data: values,
			cache: false,
			dataType: "text",
			processData: false,
			contentType: false,
			timeout: 600000,
			success: function(data, textStatus, jqXHR) {
				if (opt.success)
				{
					me.errorReader.xmlData = IG$/*mainapp*/._I13/*loadXML*/(data);
					opt.success.call(me, me);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				
			}
		});
	},
	getValues: function(values) {
		var me = this,
			items = me.items,
			item,
			v;
			
		for (i=0; i < items.items.length; i++)
		{
			item = items.items[i];
			if (item.xtype == "fileuploadfield")
			{
				if (item.$$f)
					values.append(item.name, item.$$f, item.getRawValue());
			}
			else if (item.getValue && item.name)
			{
				v = item.getValue();
				
				if (v)
					values.append(item.name, v);
			}
		}
	}
});

$s.store = $s.extend($s.dstore, {xtype: "store"});

$s.menu = $s.extend($s.base, {
	xtype: "menu",
	
	_createMenuUI: function(inpersist) {
		var me = this;
		
		if (me.$px)
		{
			me.$px.close();
			me.$px = null;
		}
		
		var i,
			popup = {
				view: "contextmenu",
				hidden: true,
			    autoheight: true,
			    borderless: true,
			    data: [
			    ],
			    on: {
					onMenuItemClick:function(id){
						var dx = me.$px.getMenuItem(id),
							key = dx.key;
							
						me._processItem.call(me, me._items, key);
						// webix.message("Submenu click: "+id);
			    	},
			    	onHide: function() {
			    		// webix.message("on destruct");
			    		if (inpersist)
			    		{
				    		me.$px.close();
				    		me.$px = null;
				    	}
			    	}
//					onBlur: function(prev_view) {
//						if (inpersist)
//						{
//							$(me.$px.$view).remove();
//						}
//					}
			    }
			};
		
		var mkey = 0;
		me._updateMenuItem(popup.data, me._items, mkey);
		
		me.$px = webix.ui(popup);
		
		return me.$px;
	},
	
	_processItem: function(items, key) {
		var i,
			proc,
			me = this;
			
		for (i=0; i < items.length; i++)
		{
			if (items[i]._menukey == key)
			{
				proc = 1;
				if (items[i].handler)
				{
					items[i].handler.call(items[i].scope || items[i]);
				}
				break;
			}
			else if (items[i].menu)
			{
				proc = me._processItem(items[i].menu._items, key);
				
				if (proc)
					break;
			}
		}
		
		return proc;
	},
	
	_updateMenuItem: function(pdata, items, mkey) {
		var i,
			menu;
		
		for (i=0; i < items.length; i++)
		{
			if (items[i].xtype == "split" || items[i].xtype == "splitter")
			{
				menu = {
					$template: "Separator",
					key: ++mkey
				};
			}
			else
			{
				menu = {
					value: items[i].text,
					key: ++mkey
				};
			}
			
			menu.hidden = items[i].hidden;
			items[i].ownerCt = this;
			items[i]._menukey = menu.key;
			
			if (items[i].menu)
			{
				menu.submenu = [];
				
				mkey = this._updateMenuItem(menu.submenu, items[i].menu._items, mkey)
			}
			
			if (!menu.hidden)
				pdata.push(menu);
		}
		
		return mkey;
	},

	showBy: function(d) {
		var me = this,
			toff = $(d).offset(),
			dx;
			
		dx = me._createMenuUI(1);
			
		dx.setPosition(toff.left + 40, toff.top + 10);
		dx.show();
	},
	showAt: function(x, y) {
		var me = this,
			dx = me._createMenuUI(1);
		
		dx.setPosition(x, y);
		dx.show();
	}
});
$s.menuitem = $s.extend($s.base, {xtype: "menuitem"});

$s.toolbar = $s.extend($s.base, {xtype: "toolbar"});

$s.textfield = $s.extend($s.base, {xtype: "textfield"});
$s.numberfield = $s.extend($s.base, {xtype: "numberfield"});

$s.button = $s.extend($s.base, {
	xtype: "button",
	initComponent: function() {
		var me = this;
		
		if (me.menu)
		{
			if (typeof(me.menu) == "object" && me.menu.length)
			{
				me.menu = {
					xtype: "menu",
					items: me.menu
				};
			}
			
			if (me.menu.items && me.menu.items.length)
			{
				if (!me.menu.xtype)
				{
					me.menu.xtype = "menu";
				}
				me._menu = me.menu;
				me.menu = me.createClassComp(me.menu);
			}
		}
		
		$s.button.superclass.initComponent.call(me);
	}
});

$s.splitbutton = $s.extend($s.button, {
	xtype: "splitbutton",
	initComponent: function() {
		var i,
			me = this,
			menu = me.menu,
			iscolorpicker = 0;
			
		if (menu && menu.items && menu.items.length)
		{
			for (i=0; i < menu.items.length; i++)
			{
				if (menu.items[i].xtype == "colorpicker")
				{
					iscolorpicker = menu.items[i];
					break;
				}
			}
			
			if (iscolorpicker)
			{
				$s.apply(me, iscolorpicker);
				me.xtype = "colorpicker";
				me.hideInput = true;
			}
		}
		$s.splitbutton.superclass.initComponent.call(me);
	}
});

$s.baseCSSPrefix = "";

$s.viewport = $s.extend($s.panel, {xtype: "viewport"});

$s.gridpanel = $s.extend($s.panel, {xtype: "gridpanel"});
$s.dataview = $s.extend($s.panel, {
	xtype: "dataview"
});

$s.html = $s.extend($s.base, {xtype: "html"});

$s.split = $s.extend($s.base, {xtype: "split"});
$s.spacer = $s.extend($s.base, {xtype: "spacer"});
$s.splitter = $s.extend($s.split, {
	xtype: "splitter"
});

$s.colorpicker = $s.extend($s.base, {
	xtype: "colorpicker"
});

$s.datefield = $s.extend($s.base, {
	xtype: "datefield"
});

$s.fieldcontainer = $s.extend($s.base, {xtype: "fieldcontainer"});
$s.fieldset = $s.extend($s.base, {
	xtype: "fieldset",
	initComponent: function() {
		var me = this;
		
		if (!me.layout)
		{
			me.layout = {
				type: "anchor"
			};
		}
		
		$s.fieldset.superclass.initComponent.call(me);
	}
});
$s.checkboxgroup = $s.extend($s.base, {xtype: "checkboxgroup"});
$s.radiogroup = $s.extend($s.base, {
	xtype: "radiogroup",
	initComponent: function() {
		var me = this,
			items = me.items,
			i,
			o;
		
		me.$options = [];
		
		if (items)
		{
			for (i=0; i < items.length; i++)
			{
				o = new $s.radio(items[i]);
				o.name = o.name;
				o.value = o.boxLabel || o.name || o.inputValue;
				me.$options.push(o);
			}
		}
		
		delete me["items"];
		
		$s.radiogroup.superclass.initComponent.call(me);
	}
});
$s.radio = $s.extend($s.object, {xtype: "radio"});
$s.checkbox = $s.extend($s.base, {xtype: "checkbox"});
$s.combobox = $s.extend($s.base, {xtype: "combobox"});
$s.displayfield = $s.extend($s.base, {xtype: "displayfield"});
$s.tbtext = $s.extend($s.base, {xtype: "tbtext"});
$s.textarea = $s.extend($s.base, {
	xtype: "textarea",
	initComponent: function() {
		var me = this;
		me.inputEl = new $s.body(me, 1);
		
		$s.textarea.superclass.initComponent.call(me);
	},
	
	getRawValue: function() {
		return this.getValue();
	},
	
	selectText: function(s1, s2) {
		var me = this,
			iel = me.inputEl,
			e = iel.dom;
		
		if (e)
		{
			if (e.setSelectionRange) // webkit
			{
				e.focus();
				e.setSelectionRange(s1, s2);
			}
			else if (e.createTextRange) // IE
			{
				range = e.createTextRange();
				range.collapse(true);
				range.moveEnd("character", s2);
				range.moveStart("character", s1);
				range.select();
			}
			else if (e.selectionStart)
			{
				e.selectionStart = s1;
				e.selectionEnd = s2;
			}
		}
	}
});
$s.view = $s.extend($s.base, {xtype: "view"});
$s.htmleditor = $s.extend($s.base, {xtype: "htmleditor"});

$s.dropzone = $s.extend($s.base, {
	xtype: "dropzone",
	initComponent: function() {
		var me = this,
			args = Array.prototype.slice.call(arguments),
			config = args[0];
			
		if (config)
		{
			me.$config = config;
			me.initDrop(config);
		}
			
		$s.dropzone.superclass.initComponent.apply(me, args);
	},
	
	initDrop: function(config) {
		var me = this;
		
		if (!config.targetEl)
			return;
			
		var f_drag = function(ev) {
			var e = $s.getEvent(ev);
			if (me.onNodeOver && me._dinfo)
			{
				me.onNodeOver.call(me, me._dinfo.t, me._dinfo.dd, e, me._dinfo.data);
			}
		};
			
		webix.DragControl.addDrop(config.targetEl, {
			//drag moves in potential drop area
			$dragIn: function(source, target, event) {
				var context = webix.DragControl.getContext(),
					t = target,
					comp = context.from.$comp,
					data = {
						records: []
					},
					dd,
					ev = $s.getEvent(event);
				
				if (me.getTargetFromEvent)
				{
					t = me.getTargetFromEvent.call(me, {
						browserEvent: event
					});
				}
				
				if (comp && comp.store && context.source && context.source.length)
				{
					$.each(context.source, function(i, src) {
						var rec = comp.store._pull[src];
						if (rec)
						{
							data.records.push(rec);
						}
					});
				}
				
				// target, dd, e, data
				if (me.onNodeEnter)
				{
					me.onNodeEnter.call(me, t, dd, ev, data)
				}
				
				if (me.onNodeOver)
				{
					me._dinfo = {
						t: t,
						dd: dd,
						data: data
					};
					
					$("body").bind("mousemove", f_drag);
				}
				
				return target;
			},
			
			//drag moves out from the drop area
			$dragOut: function(source, target, n, event) {
				$("body").unbind("mousemove", f_drag);
			},
			//drag was released
			$drop: function(source, target, event) {
				// onNodeDrop : function(target, dd, e, data){
				var context = webix.DragControl.getContext(),
					t = target,
					comp = context.from.$comp,
					data = {
						records: []
					},
					dd,
					ev = $s.getEvent(event);
					
				$("body").unbind("mousemove", f_drag);
				
				if (me.getTargetFromEvent)
				{
					t = me.getTargetFromEvent.call(me, {
						browserEvent: event
					});
				}
				
				if (comp && comp.store && context.source && context.source.length)
				{
					$.each(context.source, function(i, src) {
						var rec = comp.store._pull[src];
						if (rec)
						{
							data.records.push(rec);
						}
					});
				}
				
				// target, dd, e, data
				if (me.onNodeDrop)
				{
					me.onNodeDrop.call(me, t, dd, ev, data)
				}
			},
			//drag is started
			$drag: function(source, target, event){
			},
			//dnd is started     
			$dragCreate: function(from, event){
			},
			//dnd is finished   
			$dragDestroy: function(from, text){
			} 
		});
	}
});


$s.menuseparator = $s.extend($s.base, {xtype: "menuseparator"});
$s.tbseparator = $s.extend($s.base, {xtype: "tbseparator"});

$s.fileuploadfield = $s.extend($s.base, {
	xtype: "fileuploadfield",
	
	getRawValue: function() {
		var me = this;
		
		if (me._s && me._s.text)
		{
			return me._s.text.getValue();
		}
		
		return null;
	},
	
	getValue: function() {
		var me = this,
			r;
		if (me.$$f)
			r = me._s.text.getValue();
			
		return r;
	}
});

$s.hiddenfield = $s.extend($s.base, {xtype: "hiddenfield"});

$s.create = function() {
	var args = Array.prototype.slice.call(arguments),
		r,
		t, f,
		A,
		instance;
	
	instance = args[0];
	
	args.splice(0, 1);
	
	function f(){};
	
	if (typeof(instance) == "string")
	{
		t = instance.split(".");
		A = $s[t[1]];
	}
	else
	{
		A = instance;
	}
	
	f.prototype = A.prototype;
	
	f = new f;
	
	A.apply(f, args);
	
	return f;
};
IG$/*mainapp*/._berr = 0;

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
		
		if (errstack)
		{
			errstack = Base64.decode(errstack);
		}

		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, errdesc + "<br/>\n\n" + (errmsg || ""), null, parent, 1, "error", null, {
			errdesc: errdesc,
			errmsg: errmsg,
			errstack: errstack,
			params: params
		}, null, 1);
	}
	else
	{
		IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, errdesc + "\n\n" + (errmsg || ""), null, parent, 1, "error", null, null, null, 1);
	}
}

IG$/*mainapp*/._I52/*ShowError*/ = function(errdesc, parent) {
	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, errdesc, null, parent, 1, "error", null, null, null, 1);
}

IG$/*mainapp*/._I53/*ShowConnectionError*/ = function(panel) {
	IG$/*mainapp*/._I54/*alertmsg*/(ig$/*appoption*/.appname, IRm$/*resources*/.r1('M_ERR_CONNECT'), null, panel, 1, "error", null, null, null, 1);
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
		width: 600,
		height: 550,
        
        _cerr: 0,
        
        _s1/*showError*/: function(msg) {
            var me = this,
				
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
					
					param += k + ": " + msg.params[k];
				}
				
				param += "\n\n";
			}
			
            var m_msg = me.down("[name=m_msg]"),
                m_msg_body = m_msg.body.dom,
                mbody;
                
            m_msg_body.empty();
            
            mbody = $("<div class='ing-error-dlg'></div>").appendTo(m_msg_body);
            
            if (IG$/*mainapp*/._berr && IG$/*mainapp*/._berr.err.length > 1)
            {
                $("<div class='ing-error-cnt'>(" + (me._cerr + 1) + "/" + IG$/*mainapp*/._berr.err.length + " messages)</div>").appendTo(mbody);
            }
            
            mbody.append("<div class='ing-error-desc'>" + (msg.errcode || "") + ":" + msg.errdesc + "</div>");
            mbody.append("<div class='ing-error-msg'>" + (msg.errmsg || "") + "</div>");
            
            $("<div class='ing-error-stack'></div>").appendTo(mbody).text(msg.errstack || "");
            $("<div class='ing-error-stack'></div>").appendTo(mbody).text(param || "");
            $("<div class='ing-error-stack'></div>").appendTo(mbody).text(msg.binfo || "");
            
            me.cboard = $("<textarea class='ing-error-cboard'></textarea>").appendTo(mbody).hide();
        },
		
		_ic/*initComponent*/ : function() {
			var me = this;
			
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
                                var msg = me.a1/*messagecontent*/;
                                
								me._s1/*showError*/(msg);
							}
						}
					}
				],
				
				buttons: [
                    {
                        text: IRm$/*resources*/.r1("B_CLIPBOARD"),
                        handler: function() {
                            me.cboard.show();
                            
                            var _desc = function(msg) {
                                var d = "",
                                    k, param = "";
                                    
                                d = (msg.errdesc || "no description") + "\n";
                                
                                if (msg.params)
                                {
                                    for (k in msg.params)
                                    {
                                        if (param)
                                        {
                                            param += "\n";
                                        }
                                        
                                        param += k + ": " + msg.params[k];
                                    }
                                    
                                    param += "\n\n";
                                }
                                else
                                {
                                    param = "stacktrace : " + (msg.errstack || "") + "\n";
                                }
                                
                                d += param;
                                
                                return d;
                            };
                            
                            var tmessage = [];
                            
                            if (IG$/*mainapp*/._berr && IG$/*mainapp*/._berr.err.length)
                            {
                                $.each(IG$/*mainapp*/._berr.err, function(i, err) {
                                    tmessage.push(_desc(err.a1/*messagecontent*/));
                                });
                            }
                            else
                            {
                                tmessage.push(_desc(me.a1/*messagecontent*/));
                            }
                            
                            var binfo = "", browser = window.bowser;
                            
                            if (browser)
                            {
                                for (bk in browser)
                                {
                                    if (typeof(browser[bk]) == "function")
                                        continue;
                                        
                                    binfo += bk + ": " + browser[bk] + "\n";
                                }
                                
                                tmessage.push(binfo);
                            }
                            
                            me.cboard.text(tmessage.join("\n\n"));
                            
                            me.cboard.select();

                            try 
                            {
                                var successful = document.execCommand('copy');
                                var msg = successful ? 'successful' : 'unsuccessful';
                                console.log('Copying text command was ' + msg);
                            } 
                            catch (err) 
                            {
                                console.log('Oops, unable to copy');
                            }
                        },
                        scope: this
                    },
                    "-",
                    {
                        text: IRm$/*resources*/.r1("B_PREVIOUS"),
                        hidden: IG$/*mainapp*/._berr && IG$/*mainapp*/._berr.err.length > 1 ? false : true,
						handler: function() {
							var me = this,
                                errs = IG$/*mainapp*/._berr.err,
                                l = errs.length,
                                msg = me._cerr - 1 > -1 ? errs[me._cerr--] : null;
                                
                            if (msg)
                            {
                                me._s1/*showError*/(msg.a1/*messagecontent*/);
                            }
						},
						scope: this
                    },
                    {
                        text: IRm$/*resources*/.r1("B_NEXT"),
                        hidden: IG$/*mainapp*/._berr && IG$/*mainapp*/._berr.err.length > 1 ? false : true,
						handler: function() {
							var me = this,
                                errs = IG$/*mainapp*/._berr.err,
                                l = errs.length,
                                msg = me._cerr + 1 < l ? errs[me._cerr++] : null;
                                
                            if (msg)
                            {
                                me._s1/*showError*/(msg.a1/*messagecontent*/);
                            }
						},
						scope: this
                    },
                    "-",
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

IG$/*mainapp*/._I54/*alertmsg*/ = function(title, msg, fn, parent, ismodal, mtype, stack, a1/*messagecontent*/, btn, is_error) {
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
    
    if (is_error && IG$/*mainapp*/._berr)
    {
        // append errors
        IG$/*mainapp*/._berr.err.push({
            mtype: mtype,
            stack: stack,
            parent: parent,
            a1: a1/*messagecontent*/
        });
        
        $(".cnt", IG$/*mainapp*/._berr.h).text(IG$/*mainapp*/._berr.err.length).show();
        return;
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
        
    if (is_error)
        IG$/*mainapp*/._berr = {
            h: msgbox,
            err: [
                {
                    mtype: mtype,
                    stack: stack,
                    parent: parent,
                    a1: a1/*messagecontent*/
                }
            ]
        };
		
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
				
				pd += k + ": " + a1/*messagecontent*/.params[k];
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
		
		if (browser)
		{
			for (bk in browser)
			{
				if (typeof(browser[bk]) == "function")
					continue;
					
				binfo += bk + ": " + browser[bk] + "\n";
			}
			
			pd = binfo + "\n\n" + pd;
            a1/*messagecontent*/.binfo = binfo;
		}
	}
		
	bbox = $("<div class='igc-alert'><a class='close'>&#215;</a><div class='detail' style='display: none'>" + IRm$/*resources*/.r1("M_DETAIL") + "</div><div class='cnt' style='display:none'></div><h4 class='alert-heading'>" + h + "</h4><span>" + msg + "</span></div>").appendTo(mbody);
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
            
            if (is_error)
                IG$/*mainapp*/._berr = 0;
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
                
                if (is_error)
                    IG$/*mainapp*/._berr = 0;
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
                    
                    if (is_error)
                        IG$/*mainapp*/._berr = 0;
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
                
                if (is_error)
                    IG$/*mainapp*/._berr = 0;
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

IG$/*mainapp*/._I57/*IngPanel*/ = $s.extend($s.panel, {
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
            config = {};
        
        clearTimeout(me.__etimer);
        
        if (me.rendered && load == false)
        {
        	me.__etimer = setTimeout(function() {
		        me.loadMask && me.loadMask.destroy();
		        me.rendermask = null;
		        me.loadMask = null;
		    }, 100);
	    }
            
        if (me.rendered) 
        {
            if (load !== false) 
            {
                if (IG$/*mainapp*/.isObject(load)) 
                {
                    IG$/*mainapp*/.apply(config, load);
                } 
                else if (IG$/*mainapp*/.isString(load)) 
                {
                    config.msg = load;
                }
                
                config.dom = $(me.el.dom);
                config.target = me;
                
                if (!me.loadMask)
                {
	                me.loadMask = new IG$/*mainapp*/._pbm/*mask*/(config);
	                me.loadMask.show();
	            }
            }
        }
		return me.loadMask;
	}
});

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


IG$/*mainapp*/.m2ER = function() {
	var fields = [];
	var config = {
		type: 'xml',
		root: 'smsg',
		record: 'item',
		success: '@success'
	}
};

