(function(){d3.geo={};var f=Math.PI/180;d3.geo.azimuthal=function(){var v="orthographic",y,t=200,s=[480,250],q,x,u,w;function r(K){var A=K[0]*f-q,J=K[1]*f,E=Math.cos(A),z=Math.sin(A),C=Math.cos(J),I=Math.sin(J),B=v!=="orthographic"?w*I+u*C*E:null,F,D=v==="stereographic"?1/(1+B):v==="gnomonic"?1/B:v==="equidistant"?(F=Math.acos(B),F?F/Math.sin(F):0):v==="equalarea"?Math.sqrt(2/(1+B)):1,H=D*C*z,G=D*(w*C*E-u*I);return[t*H+s[0],t*G+s[1]]}r.invert=function(C){var z=(C[0]-s[0])/t,F=(C[1]-s[1])/t,A=Math.sqrt(z*z+F*F),E=v==="stereographic"?2*Math.atan(A):v==="gnomonic"?Math.atan(A):v==="equidistant"?A:v==="equalarea"?2*Math.asin(0.5*A):Math.asin(A),B=Math.sin(E),D=Math.cos(E);return[(q+Math.atan2(z*B,A*u*D+F*w*B))/f,Math.asin(D*w-(A?(F*B*u)/A:0))/f]};r.mode=function(z){if(!arguments.length){return v}v=z+"";return r};r.origin=function(z){if(!arguments.length){return y}y=z;q=y[0]*f;x=y[1]*f;u=Math.cos(x);w=Math.sin(x);return r};r.scale=function(z){if(!arguments.length){return t}t=+z;return r};r.translate=function(z){if(!arguments.length){return s}s=[+z[0],+z[1]];return r};return r.origin([0,0])};d3.geo.albers=function(){var y=[-98,38],w=[29.5,45.5],v=1000,u=[480,250],x,t,r,z;function s(C){var A=t*(f*C[0]-x),B=Math.sqrt(r-2*t*Math.sin(f*C[1]))/t;return[v*B*Math.sin(A)+u[0],v*(B*Math.cos(A)-z)+u[1]]}s.invert=function(D){var A=(D[0]-u[0])/v,F=(D[1]-u[1])/v,E=z+F,B=Math.atan2(A,E),C=Math.sqrt(A*A+E*E);return[(x+B/t)/f,Math.asin((r-C*C*t*t)/(2*t))/f]};function q(){var B=f*w[0],A=f*w[1],E=f*y[1],C=Math.sin(B),D=Math.cos(B);x=f*y[0];t=0.5*(C+Math.sin(A));r=D*D+2*t*C;z=Math.sqrt(r-2*t*Math.sin(E))/t;return s}s.origin=function(A){if(!arguments.length){return y}y=[+A[0],+A[1]];return q()};s.parallels=function(A){if(!arguments.length){return w}w=[+A[0],+A[1]];return q()};s.scale=function(A){if(!arguments.length){return v}v=+A;return s};s.translate=function(A){if(!arguments.length){return u}u=[+A[0],+A[1]];return s};return q()};d3.geo.albersUsa=function(){var q=d3.geo.albers();var u=d3.geo.albers().origin([-160,60]).parallels([55,65]);var t=d3.geo.albers().origin([-160,20]).parallels([8,18]);var s=d3.geo.albers().origin([-60,10]).parallels([8,18]);function r(x){var w=x[0],v=x[1];return(v>50?u:w<-140?t:v<21?s:q)(x)}r.scale=function(v){if(!arguments.length){return q.scale()}q.scale(v);u.scale(v*0.6);t.scale(v);s.scale(v*1.5);return r.translate(q.translate())};r.translate=function(w){if(!arguments.length){return q.translate()}var v=q.scale()/1000,z=w[0],y=w[1];q.translate(w);u.translate([z-400*v,y+170*v]);t.translate([z-190*v,y+200*v]);s.translate([z+580*v,y+430*v]);return r};return r.scale(q.scale())};d3.geo.bonne=function(){var v=200,u=[480,250],q,t,s,r;function w(C){var z=C[0]*f-q,D=C[1]*f-t;if(s){var B=r+s-D,A=z*Math.cos(D)/B;z=B*Math.sin(A);D=B*Math.cos(A)-r}else{z*=Math.cos(D);D*=-1}return[v*z+u[0],v*D+u[1]]}w.invert=function(B){var z=(B[0]-u[0])/v,D=(B[1]-u[1])/v;if(s){var C=r+D,A=Math.sqrt(z*z+C*C);D=r+s-A;z=q+A*Math.atan2(z,C)/Math.cos(D)}else{D*=-1;z/=Math.cos(D)}return[z/f,D/f]};w.parallel=function(y){if(!arguments.length){return s/f}r=1/Math.tan(s=y*f);return w};w.origin=function(y){if(!arguments.length){return[q/f,t/f]}q=y[0]*f;t=y[1]*f;return w};w.scale=function(y){if(!arguments.length){return v}v=+y;return w};w.translate=function(y){if(!arguments.length){return u}u=[+y[0],+y[1]];return w};return w.origin([0,0]).parallel(45)};d3.geo.equirectangular=function(){var s=500,r=[480,250];function q(u){var t=u[0]/360,v=-u[1]/360;return[s*t+r[0],s*v+r[1]]}q.invert=function(u){var t=(u[0]-r[0])/s,v=(u[1]-r[1])/s;return[360*t,-360*v]};q.scale=function(t){if(!arguments.length){return s}s=+t;return q};q.translate=function(t){if(!arguments.length){return r}r=[+t[0],+t[1]];return q};return q};d3.geo.mercator=function(){var s=500,r=[480,250];function q(u){var t=u[0]/360,v=-(Math.log(Math.tan(Math.PI/4+u[1]*f/2))/f)/360;return[s*t+r[0],s*Math.max(-0.5,Math.min(0.5,v))+r[1]]}q.invert=function(u){var t=(u[0]-r[0])/s,v=(u[1]-r[1])/s;return[360*t,2*Math.atan(Math.exp(-360*v*f))/f-90]};q.scale=function(t){if(!arguments.length){return s}s=+t;return q};q.translate=function(t){if(!arguments.length){return r}r=[+t[0],+t[1]];return q};return q};function k(r,q){return function(s){return s&&s.type in r?r[s.type](s):q}}d3.geo.path=function(){var w=4.5,A=h(w),v=d3.geo.albersUsa();function z(C,B){if(typeof w==="function"){A=h(w.apply(this,arguments))}return r(C)||null}function x(B){return v(B).join(",")}var r=k({FeatureCollection:function(E){var D=[],C=E.features,B=-1,F=C.length;while(++B<F){D.push(r(C[B].geometry))}return D.join("")},Feature:function(B){return r(B.geometry)},Point:function(B){return"M"+x(B.coordinates)+A},MultiPoint:function(E){var C=[],D=E.coordinates,B=-1,F=D.length;while(++B<F){C.push("M",x(D[B]),A)}return C.join("")},LineString:function(E){var C=["M"],D=E.coordinates,B=-1,F=D.length;while(++B<F){C.push(x(D[B]),"L")}C.pop();return C.join("")},MultiLineString:function(H){var F=[],G=H.coordinates,E=-1,I=G.length,C,D,B;while(++E<I){C=G[E];D=-1;B=C.length;F.push("M");while(++D<B){F.push(x(C[D]),"L")}F.pop()}return F.join("")},Polygon:function(H){var F=[],G=H.coordinates,E=-1,I=G.length,C,D,B;while(++E<I){C=G[E];D=-1;if((B=C.length-1)>0){F.push("M");while(++D<B){F.push(x(C[D]),"L")}F[F.length-1]="Z"}}return F.join("")},MultiPolygon:function(C){var L=[],K=C.coordinates,J=-1,D=K.length,G,I,E,H,F,B;while(++J<D){G=K[J];I=-1;E=G.length;while(++I<E){H=G[I];F=-1;if((B=H.length-1)>0){L.push("M");while(++F<B){L.push(x(H[F]),"L")}L[L.length-1]="Z"}}}return L.join("")},GeometryCollection:function(E){var D=[],C=E.geometries,B=-1,F=C.length;while(++B<F){D.push(r(C[B]))}return D.join("")}});var s=z.area=k({FeatureCollection:function(E){var D=0,C=E.features,B=-1,F=C.length;while(++B<F){D+=s(C[B])}return D},Feature:function(B){return s(B.geometry)},Polygon:function(B){return u(B.coordinates)},MultiPolygon:function(E){var C=0,D=E.coordinates,B=-1,F=D.length;while(++B<F){C+=u(D[B])}return C},GeometryCollection:function(E){var D=0,C=E.geometries,B=-1,F=C.length;while(++B<F){D+=s(C[B])}return D}},0);function u(D){var C=t(D[0]),B=0,E=D.length;while(++B<E){C-=t(D[B])}return C}function q(J){var H=d3.geom.polygon(J[0].map(v)),B=H.area(),C=H.centroid(B<0?(B*=-1,1):-1),I=C[0],G=C[1],F=B,E=0,D=J.length;while(++E<D){H=d3.geom.polygon(J[E].map(v));B=H.area();C=H.centroid(B<0?(B*=-1,1):-1);I-=C[0];G-=C[1];F-=B}return[I,G,6*F]}var y=z.centroid=k({Feature:function(B){return y(B.geometry)},Polygon:function(C){var B=q(C.coordinates);return[B[0]/B[2],B[1]/B[2]]},MultiPolygon:function(C){var B=0,J=C.coordinates,D,I=0,H=0,G=0,F=-1,E=J.length;while(++F<E){D=q(J[F]);I+=D[0];H+=D[1];G+=D[2]}return[I/G,H/G]}});function t(B){return Math.abs(d3.geom.polygon(B.map(v)).area())}z.projection=function(B){v=B;return z};z.pointRadius=function(B){if(typeof B==="function"){w=B}else{w=+B;A=h(w)}return z};return z};function h(q){return"m0,"+q+"a"+q+","+q+" 0 1,1 0,"+(-2*q)+"a"+q+","+q+" 0 1,1 0,"+(+2*q)+"z"}d3.geo.bounds=function(s){var u=Infinity,q=Infinity,r=-Infinity,t=-Infinity;c(s,function(v,w){if(v<u){u=v}if(v>r){r=v}if(w<q){q=w}if(w>t){t=w}});return[[u,q],[r,t]]};function c(r,q){if(r.type in p){p[r.type](r,q)}}var p={Feature:n,FeatureCollection:j,GeometryCollection:i,LineString:d,MultiLineString:o,MultiPoint:d,MultiPolygon:e,Point:b,Polygon:m};function n(r,q){c(r.geometry,q)}function j(t,s){for(var q=t.features,r=0,u=q.length;r<u;r++){c(q[r].geometry,s)}}function i(t,s){for(var q=t.geometries,r=0,u=q.length;r<u;r++){c(q[r],s)}}function d(t,s){for(var q=t.coordinates,r=0,u=q.length;r<u;r++){s.apply(null,q[r])}}function o(w,v){for(var s=w.coordinates,u=0,x=s.length;u<x;u++){for(var r=s[u],t=0,q=r.length;t<q;t++){v.apply(null,r[t])}}}function e(w,v){for(var s=w.coordinates,u=0,x=s.length;u<x;u++){for(var r=s[u][0],t=0,q=r.length;t<q;t++){v.apply(null,r[t])}}}function b(r,q){q.apply(null,r.coordinates)}function m(t,s){for(var q=t.coordinates[0],r=0,u=q.length;r<u;r++){s.apply(null,q[r])}}d3.geo.circle=function(){var y=[0,0],v=90-0.01,w=v*f,s=d3.geo.greatArc().target(Object);function r(){}function t(z){return s.distance(z)<w}r.clip=function(z){s.source(typeof y==="function"?y.apply(this,arguments):y);return x(z)};var x=k({FeatureCollection:function(A){var z=A.features.map(x).filter(Object);return z&&(A=Object.create(A),A.features=z,A)},Feature:function(A){var z=x(A.geometry);return z&&(A=Object.create(A),A.geometry=z,A)},Point:function(z){return t(z.coordinates)&&z},MultiPoint:function(A){var z=A.coordinates.filter(t);return z.length&&{type:A.type,coordinates:z}},LineString:function(A){var z=u(A.coordinates);return z.length&&(A=Object.create(A),A.coordinates=z,A)},MultiLineString:function(A){var z=A.coordinates.map(u).filter(function(B){return B.length});return z.length&&(A=Object.create(A),A.coordinates=z,A)},Polygon:function(A){var z=A.coordinates.map(u);return z[0].length&&(A=Object.create(A),A.coordinates=z,A)},MultiPolygon:function(A){var z=A.coordinates.map(function(B){return B.map(u)}).filter(function(B){return B[0].length});return z.length&&(A=Object.create(A),A.coordinates=z,A)},GeometryCollection:function(A){var z=A.geometries.map(x).filter(Object);return z.length&&(A=Object.create(A),A.geometries=z,A)}});function u(E){var D=-1,B=E.length,C=[],H,G,F,A,z;while(++D<B){z=s.distance(F=E[D]);if(z<w){if(G){C.push(l(G,F)((A-w)/(A-z)))}C.push(F);H=G=null}else{G=F;if(!H&&C.length){C.push(l(C[C.length-1],G)((w-A)/(z-A)));H=G}}A=z}if(G&&C.length){z=s.distance(F=C[0]);C.push(l(G,F)((A-w)/(A-z)))}return q(C)}function q(F){var D=0,G=F.length,C,z,A=G?[F[0]]:F,E,B=s.source();while(++D<G){E=s.source(F[D-1])(F[D]).coordinates;for(C=0,z=E.length;++C<z;){A.push(E[C])}}s.source(B);return A}r.origin=function(z){if(!arguments.length){return y}y=z;return r};r.angle=function(z){if(!arguments.length){return v}w=(v=+z)*f;return r};r.precision=function(z){if(!arguments.length){return s.precision()}s.precision(z);return r};return r};d3.geo.greatArc=function(){var s=g,t=a,r=6*f;function q(){var v=typeof s==="function"?s.apply(this,arguments):s,u=typeof t==="function"?t.apply(this,arguments):t,x=l(v,u),y=r/x.d,w=0,z=[v];while((w+=y)<1){z.push(x(w))}z.push(u);return{type:"LineString",coordinates:z}}q.distance=function(){var v=typeof s==="function"?s.apply(this,arguments):s,u=typeof t==="function"?t.apply(this,arguments):t;return l(v,u).d};q.source=function(u){if(!arguments.length){return s}s=u;return q};q.target=function(u){if(!arguments.length){return t}t=u;return q};q.precision=function(u){if(!arguments.length){return r/f}r=u*f;return q};return q};function g(q){return q.source}function a(q){return q.target}function l(E,B){var t=E[0]*f,A=Math.cos(t),s=Math.sin(t),G=E[1]*f,v=Math.cos(G),F=Math.sin(G),r=B[0]*f,z=Math.cos(r),q=Math.sin(r),D=B[1]*f,u=Math.cos(D),C=Math.sin(D),y=w.d=Math.acos(Math.max(-1,Math.min(1,F*C+v*u*Math.cos(r-t)))),x=Math.sin(y);function w(J){var I=Math.sin(y-(J*=y))/x,M=Math.sin(J)/x,H=I*v*A+M*u*z,L=I*v*s+M*u*q,K=I*F+M*C;return[Math.atan2(L,H)/f,Math.atan2(K,Math.sqrt(H*H+L*L))/f]}return w}d3.geo.greatCircle=d3.geo.circle})();