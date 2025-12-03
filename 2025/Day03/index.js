const i = require(`fs`).readFileSync(`i`).toString`utf8`;
// Keep all sls for history
// i = string of input

t=0
for(l of i.split`\n`)for(n=99;n;n--)l.match((n/10|0)+".*"+n%10)&&(n=console.log(t+=n))

// for(l of i.split`\n`)for(n=99;n>1;n--)l.match((n/10|0)+".*"+n%10)&&console.log(t+=n)&(n=0)
// for(l of i.split`\n`)for(n=99;n>1;n--)l.match((n/10|0)+".*"+n%10)&&(t+=n)&(n=0)    
//    for(l of i.split`\n`)for(n=99;n>1;n-=l.match((n/10|0)+".*"+n%10) ? (t+=n)&(n=0) : 1)
// console.log(t)
// m=(l,d)=>Math.max()

// Relies on \r characters remaining per line, else a -d must be a.length-d+1 is needed in the first slice
t=0
m=(a,d)=>a.indexOf(Math.max(...a.slice(0,-d).split``))
g=(a,d)=>d==0?'':a[z=m(a+"z",d)]+g(a.slice(z+1),d-1)
for(a of i.split`\r\n`) t+=+g(a,12)
console.log(t)
