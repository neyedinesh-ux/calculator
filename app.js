
var $=function(i){return document.getElementById(i)||{addEventListener:function(){},dataset:{},style:{}}};
function bn(s){return String(s)}
function f(n,d){return bn(Number(n).toLocaleString("en-US",{maximumFractionDigits:d==null?0:d}))}
function row(a,b){return '<div class="line"><span>'+a+'</span><b>'+b+'</b></div>'}


function pmt(P,r,n){return r===0?P/n:P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)}
function months(v,u){var x=parseFloat($(v).value),k=$(u).value;return Math.round(k==="y"?x*12:x)}
function termOk(n){return n>=1&&n<=480}
document.addEventListener("click",function(e){
  var c=e.target.closest(".chip");if(!c||!c.dataset.i)return;
  $(c.dataset.i).value=c.dataset.v;$(c.dataset.u).value=c.dataset.x;$(c.dataset.b).click();
});

$("b-emi").onclick=function(){
  var P=parseFloat($("e1").value),R=parseFloat($("e2").value),r=R/1200,n=months("e3","e4"),o=$("r-emi"),t=$("c-emi");
  if(!(P>0)||!(R>=0)||!termOk(n)){o.innerHTML='<div class="err">Enter a valid amount and rate, and a term from 1 month to 40 years.</div>';t.innerHTML="";return}
  var emi=pmt(P,r,n),tot=emi*n;
  o.innerHTML='<div class="big">'+f(emi)+' per month</div>'+row("Loan amount",f(P))+row("Extra you pay (interest)",f(tot-P)+" ("+f((tot-P)/P*100,1)+"% of loan)")+row("Total amount you pay",f(tot))+row("Term",f(n)+" months ("+f(n/12,1)+" years)");
  var h='<h3>Compare terms</h3><div class="tw"><table><tr><th>Term</th><th>EMI</th><th>Interest</th><th>Total</th></tr>';
  [[3,"3 months"],[6,"6 months"],[12,"1 year"],[24,"2 years"],[36,"3 years"],[60,"5 years"],[120,"10 years"],[240,"20 years"]].forEach(function(x){
    var m=pmt(P,r,x[0]);h+='<tr><td>'+x[1]+'</td><td>'+f(m)+'</td><td>'+f(m*x[0]-P)+'</td><td>'+f(m*x[0])+'</td></tr>';
  });
  t.innerHTML=h+'</table></div><h3>Payment schedule</h3><div class="chips"><button type="button" class="chip" id="sv-m">By month</button><button type="button" class="chip" id="sv-y">By year</button></div><div class="tw sch" id="sch"></div>';
  var bal=P,M=[],Y=[];
  for(var i=1;i<=n;i++){var it=bal*r,pr=emi-it;bal=Math.max(bal-pr,0);M.push([i,emi,pr,it,bal]);var yi=Math.ceil(i/12)-1;if(!Y[yi])Y[yi]=[yi+1,0,0,0,0];Y[yi][1]+=emi;Y[yi][2]+=pr;Y[yi][3]+=it;Y[yi][4]=bal}
  function draw(v){var d=v==="m"?M:Y,x='<table><tr><th>'+(v==="m"?"Month":"Year")+'</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>';
    d.forEach(function(q){x+='<tr><td>'+f(q[0])+'</td><td>'+f(q[1])+'</td><td>'+f(q[2])+'</td><td>'+f(q[3])+'</td><td>'+f(q[4])+'</td></tr>'});
    $("sch").innerHTML=x+'</table>'}
  $("sv-m").onclick=function(){draw("m")};$("sv-y").onclick=function(){draw("y")};
  draw(n>24?"y":"m");
};

$("b-loan").onclick=function(){
  var M=parseFloat($("n1").value),R=parseFloat($("n2").value),r=R/1200,n=months("n3","n4"),o=$("r-loan");
  if(!(M>0)||!(R>=0)||!termOk(n)){o.innerHTML='<div class="err">Enter a valid payment and rate, and a term from 1 month to 40 years.</div>';return}
  var P=r===0?M*n:M*(1-Math.pow(1+r,-n))/r;
  o.innerHTML='<div class="big">'+f(P)+'</div>'+row("You pay in total",f(M*n))+row("Total interest",f(M*n-P))+row("Number of instalments",f(n));
};

$("b-save").onclick=function(){
  var P=parseFloat($("s1").value),R=parseFloat($("s2").value)/100,n=months("s3","s4"),k=parseInt($("s5").value,10),o=$("r-save");
  if(!(P>0)||!(R>=0)||!termOk(n)){o.innerHTML='<div class="err">Enter a valid amount and rate, and a term from 1 month to 40 years.</div>';return}
  var y=n/12,A=k===0?P*(1+R*y):P*Math.pow(1+R/k,k*y);
  var h='<div class="big">'+f(A)+'</div>'+row("Interest earned",f(A-P))+row("Deposit",f(P));
  if(k>0)h+=row("Effective yearly rate",f((Math.pow(1+R/k,k)-1)*100,2)+"%");
  o.innerHTML=h;
};

function pc(){
  var a=parseFloat($("p1").value),b=parseFloat($("p2").value);
  $("r-p1").innerHTML=(isNaN(a)||isNaN(b))?"":'<div class="big">'+f(a*b/100,4)+'</div>';
  a=parseFloat($("p3").value);b=parseFloat($("p4").value);
  $("r-p2").innerHTML=(isNaN(a)||!b)?"":'<div class="big">'+f(a/b*100,4)+'%</div>';
  a=parseFloat($("p5").value);b=parseFloat($("p6").value);
  $("r-p3").innerHTML=(isNaN(a)||isNaN(b)||!a)?"":'<div class="big">'+(b>=a?"+":"")+f((b-a)/Math.abs(a)*100,4)+'%</div>'+row("Change",f(b-a,4));
}
["p1","p2","p3","p4","p5","p6"].forEach(function(i){$(i).addEventListener("input",pc)});
pc();

$("b-age").onclick=function(){
  var v=$("a1").value,o=$("r-age");
  if(!v){o.innerHTML='<div class="err">Pick a date of birth.</div>';return}
  var b=new Date(v),t=new Date();t.setHours(0,0,0,0);
  if(b>t){o.innerHTML='<div class="err">The date of birth must be before today.</div>';return}
  var y=t.getFullYear()-b.getFullYear(),m=t.getMonth()-b.getMonth(),d=t.getDate()-b.getDate();
  if(d<0){m--;d+=new Date(t.getFullYear(),t.getMonth(),0).getDate()}
  if(m<0){y--;m+=12}
  var nb=new Date(t.getFullYear(),b.getMonth(),b.getDate());if(nb<t)nb.setFullYear(t.getFullYear()+1);
  var days=Math.round((t-b)/864e5),nd=Math.round((nb-t)/864e5);
  o.innerHTML='<div class="big">'+f(y)+' years '+f(m)+' months '+f(d)+' days</div>'+row("Total days",f(days))+row("Next birthday",nd===0?"Today":"in "+f(nd)+" days");
};

$("b-bmi").onclick=function(){
  var w=parseFloat($("m1").value),hc=parseFloat($("m2").value),o=$("r-bmi");
  if(!(w>0)||!(hc>0)){o.innerHTML='<div class="err">Enter a valid weight and height.</div>';return}
  var m=hc/100,b=w/(m*m),c=b<18.5?"Underweight":b<25?"Normal":b<30?"Overweight":"Obese";
  var lo=18.5*m*m,hi=24.9*m*m;
  o.innerHTML='<div class="big">'+f(b,1)+' ('+c+')</div>'+row("Normal weight range",f(lo,1)+" – "+f(hi,1)+" kg");
};

$("b-land").onclick=function(){
  var q=parseFloat($("l1").value),u=parseFloat($("l2").value),o=$("r-land");
  if(!(q>0)){o.innerHTML='<div class="err">Enter a valid amount.</div>';return}
  var sf=q*u;
  o.innerHTML=row("Square feet",f(sf,2))+row("Decimal",f(sf/435.6,3))+row("Katha",f(sf/720,3))+row("Bigha",f(sf/14400,4))+row("Acre",f(sf/43560,4))+row("Square metres",f(sf/10.7639,2));
};
