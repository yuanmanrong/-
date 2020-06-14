let fs=require('fs');
let arr=fs.readdirSync('./img');
let result =[];

arr.forEach(item=>{
    if(/\.(PNG|JPEG|JPG)/i.test(item)){
        result.push(`img/`+item);
    }
})
fs.writeFileSync('./img/result.txt',JSON.stringify(result),'utf-8')
