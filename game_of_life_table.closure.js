window.gameOfLifeInTable=function(){function p(a){a=a.toString();return q.hasOwnProperty(a)?q[a]:0}function s(a){return"x"+a[0]+"y"+a[1]}function t(a){a=a.toString();return void 0===l[a]?!0:0===l[a]}function u(a){a=a.toString();return void 0===l[a]?!1:1===l[a]}function w(a){l[a.toString()]=1;document.getElementById(s(a)).style.backgroundColor=x}function y(a){var d=a.toString(),b,c,e,g;if(!v.hasOwnProperty(d)){b=a[0];a=a[1];c=z;b=[c(b-1,a-1),c(b,a-1),c(b+1,a-1),c(b-1,a),c(b+1,a),c(b-1,a+1),c(b,a+1),
c(b+1,a+1)];g=[];a=b.length;for(c=0;c<a;c++)e=b[c],0<=e[0]&&e[0]<f&&0<=e[1]&&e[1]<h&&g.push(e);v[d]=g}return v[d]}function A(a){var d=y(a),b=d.length,c,e;for(c=0;c<b;c++)a=d[c],e=p(a)+1,q[a.toString()]=e,3===e&&t(a)?n.push(a):4===e&&u(a)&&m.push(a)}function F(){var a,d;a=0;for(d=n.length;a<d;a++){var b=n[a];t(b)&&3===p(b)&&(w(b),k.push(b))}a=0;for(d=m.length;a<d;a++){var b=m[a],c=p(b);u(b)&&(2>c||3<c)&&(c=b,l[c.toString()]=0,document.getElementById(s(c)).style.backgroundColor=B,r.push(b))}n.length=
0;a=m.length=0;for(d=k.length;a<d;a++)A(k[a]);a=0;for(d=r.length;a<d;a++)for(var b=void 0,c=y(r[a]),e=c.length,g=void 0,f=void 0,g=0;g<e;g++)b=c[g],f=p(b)-1,q[b.toString()]=f,3===f&&t(b)?n.push(b):1===f&&u(b)&&m.push(b);k.length=0;r.length=0}var x,B,C,f,h,z,D,l={},E,q={},k=[],r=[],n=[],m=[],v={};return{init:function(a){f=a.cellcount_x;h=a.cellcount_y;x=a.colour_alive;B=a.colour_dead;C=a.colour_init;E=a.tbody;z=a.topology;D=a.automaton;var d,b,c;for(a=0;a<h;a++){b=document.createElement("tr");b.id=
"y"+a;for(d=0;d<f;d++)c=document.createElement("td"),c.id=s([d,a]),c.style.backgroundColor=C,b.appendChild(c);E.appendChild(b)}a=D;b=a.length;for(d=0;d<b;d++)c=a[d],w(c),k.push(c),A(c);m=k.slice();k.length=0;return F},automatons:{glider:function(){return[[2,1],[3,2],[1,3],[2,3],[3,3]]},gosper_gun:function(){return[[25,1],[23,2],[25,2],[13,3],[14,3],[21,3],[22,3],[35,3],[36,3],[12,4],[16,4],[21,4],[22,4],[35,4],[36,4],[1,5],[2,5],[11,5],[17,5],[21,5],[22,5],[1,6],[2,6],[11,6],[15,6],[17,6],[18,6],
[23,6],[25,6],[11,7],[17,7],[25,7],[12,8],[16,8],[13,9],[14,9]]}},topologies:{closed:function(a,d){var b,c;0<=a&&a<f?b=a:0>a?b=a+f:a>=f&&(b=f-a);0<=d&&d<h?c=d:0>d?c=d+h:d>=h&&(c=h-d);return[b,c]},unbounded:function(a,d){return[a,d]}}}};
