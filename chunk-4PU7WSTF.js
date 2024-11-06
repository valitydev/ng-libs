import{a as y,d as D,e as m}from"./chunk-N6VQQ3KF.js";import{a as h}from"./chunk-JGOZMBOU.js";import"./chunk-BAEK5B6P.js";import"./chunk-ACSSPQ7R.js";import"./chunk-4ILGD7H2.js";import{a as r}from"./chunk-CWCQGWZN.js";import{Ja as b}from"./chunk-KZLY3U5Q.js";import"./chunk-D32FDPIX.js";import{Tb as g,Ub as i,Vb as F,Za as B,eb as k,ha as l,pb as o}from"./chunk-YY7FQGQK.js";import"./chunk-2QO75U7C.js";import"./chunk-6M6IQ4ZI.js";import{a as d,b as t,h as f}from"./chunk-MTNKEJWM.js";var u=f(b());var x=()=>({active:"name",direction:"asc"}),E=(()=>{let s=class s{constructor(){this.columns=[{field:"id"},{field:"name"},{field:"date",cell:{type:"datetime"}}],this.data=[{id:12,name:"Max",date:new Date},{id:5,name:"Alex",date:new Date},{id:9,name:"Ray",date:new Date}]}};s.\u0275fac=function(a){return new(a||s)},s.\u0275cmp=l({type:s,selectors:[["ng-component"]],standalone:!0,features:[i],decls:1,vars:4,consts:[["sortOnFront","",3,"columns","data","sort"]],template:function(a,p){a&1&&o(0,"v-table",0),a&2&&k("columns",p.columns)("data",p.data)("sort",F(3,x))},dependencies:[m,D],encapsulation:2});let n=s;return n})();var T={title:"Table",mdFile:"./index.md",category:y,demos:{DemoComponent:E}},e=T;var C=[];var M={DemoComponent:[{title:"TypeScript",code:`<pre class="shiki shiki-themes github-light ayu-dark" style="background-color:#fff;--shiki-dark-bg:#0b0e14;color:#24292e;--shiki-dark:#bfbdb6" tabindex="0"><code class="language-angular-ts"><span class="line"><span style="color:#D73A49;--shiki-dark:#FF8F40" class="ngde">import</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> { Component } </span><span style="color:#D73A49;--shiki-dark:#FF8F40" class="ngde">from</span><span style="color:#032F62;--shiki-dark:#AAD94C" class="ngde"> '@angular/core'</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">;</span></span>
<span class="line"><span style="color:#D73A49;--shiki-dark:#FF8F40" class="ngde">import</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> { <a href="api/classes/ng-core/components/TableModule" class="ng-doc-code-anchor ngde">TableModule</a></span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> <a href="api/interfaces/ng-core/components/Column" class="ng-doc-code-anchor ngde">Column</a> } </span><span style="color:#D73A49;--shiki-dark:#FF8F40" class="ngde">from</span><span style="color:#032F62;--shiki-dark:#AAD94C" class="ngde"> '@vality/ng-core'</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;--shiki-dark:#FF8F40" class="ngde">interface</span><span style="color:#6F42C1;--shiki-dark:#59C2FF" class="ngde"> User</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> {</span></span>
<span class="line"><span style="color:#E36209;--shiki-dark:#BFBDB6" class="ngde">    id</span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde">:</span><span style="color:#005CC5;--shiki-dark:#39BAE6" class="ngde"> number</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">;</span></span>
<span class="line"><span style="color:#E36209;--shiki-dark:#BFBDB6" class="ngde">    name</span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde">:</span><span style="color:#005CC5;--shiki-dark:#39BAE6" class="ngde"> string</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">;</span></span>
<span class="line"><span style="color:#E36209;--shiki-dark:#BFBDB6" class="ngde">    date</span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde">:</span><span style="color:#6F42C1;--shiki-dark:#59C2FF" class="ngde"> Date</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">;</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#E6B673" class="ngde">@</span><span style="color:#6F42C1;--shiki-dark:#FFB454" class="ngde">Component</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">({</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">    standalone</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">:</span><span style="color:#005CC5;--shiki-dark:#D2A6FF" class="ngde"> true</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">    template</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">:</span><span style="color:#032F62;--shiki-dark:#AAD94C" class="ngde"> \`</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#39BAE680" class="ngde">        &#x3C;</span><span style="color:#22863A;--shiki-dark:#39BAE6" class="ngde">v-table</span></span>
<span class="line"><span style="color:#6F42C1;--shiki-dark:#FFB454" class="ngde">            [columns]</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">=</span><span style="color:#032F62;--shiki-dark:#AAD94C" class="ngde">"columns"</span></span>
<span class="line"><span style="color:#6F42C1;--shiki-dark:#FFB454" class="ngde">            [data]</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">=</span><span style="color:#032F62;--shiki-dark:#AAD94C" class="ngde">"data"</span></span>
<span class="line"><span style="color:#6F42C1;--shiki-dark:#FFB454" class="ngde">            [sort]</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">=</span><span style="color:#032F62;--shiki-dark:#AAD94C" class="ngde">"{ active: 'name', direction: 'asc' }"</span></span>
<span class="line"><span style="color:#6F42C1;--shiki-dark:#FFB454" class="ngde">            sortOnFront</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#39BAE680" class="ngde">        >&#x3C;/</span><span style="color:#22863A;--shiki-dark:#39BAE6" class="ngde">v-table</span><span style="color:#24292E;--shiki-dark:#39BAE680" class="ngde">></span></span>
<span class="line"><span style="color:#032F62;--shiki-dark:#AAD94C" class="ngde">    \`</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">    imports</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">:</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> [</span><span style="color:#24292E;--shiki-dark:#E6B673" class="ngde"><a href="api/classes/ng-core/components/TableModule" class="ng-doc-code-anchor ngde">TableModule</a></span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">]</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">})</span></span>
<span class="line"><span style="color:#D73A49;--shiki-dark:#FF8F40" class="ngde">export</span><span style="color:#D73A49;--shiki-dark:#FF8F40" class="ngde"> class</span><span style="color:#6F42C1;--shiki-dark:#59C2FF" class="ngde"> DemoComponent</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> {</span></span>
<span class="line"><span style="color:#E36209;--shiki-dark:#BFBDB6" class="ngde">    columns</span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde">:</span><span style="color:#6F42C1;--shiki-dark:#59C2FF" class="ngde"> <a href="api/interfaces/ng-core/components/Column" class="ng-doc-code-anchor ngde">Column</a></span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">&#x3C;</span><span style="color:#6F42C1;--shiki-dark:#59C2FF" class="ngde">User</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">>[] </span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde">=</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> [</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">        { field</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">:</span><span style="color:#032F62;--shiki-dark:#AAD94C" class="ngde"> 'id'</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> }</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">        { field</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">:</span><span style="color:#032F62;--shiki-dark:#AAD94C" class="ngde"> 'name'</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> }</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">        { field</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">:</span><span style="color:#032F62;--shiki-dark:#AAD94C" class="ngde"> 'date'</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> cell</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">:</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> { type</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">:</span><span style="color:#032F62;--shiki-dark:#AAD94C" class="ngde"> 'datetime'</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> } }</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">    ]</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">;</span></span>
<span class="line"><span style="color:#E36209;--shiki-dark:#BFBDB6" class="ngde">    data</span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde">:</span><span style="color:#6F42C1;--shiki-dark:#59C2FF" class="ngde"> User</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">[] </span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde">=</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> [</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">        { id</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">:</span><span style="color:#005CC5;--shiki-dark:#D2A6FF" class="ngde"> 12</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> name</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">:</span><span style="color:#032F62;--shiki-dark:#AAD94C" class="ngde"> 'Max'</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> date</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">:</span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde"> new</span><span style="color:#6F42C1;--shiki-dark:#FFB454" class="ngde"> Date</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">() }</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">        { id</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">:</span><span style="color:#005CC5;--shiki-dark:#D2A6FF" class="ngde"> 5</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> name</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">:</span><span style="color:#032F62;--shiki-dark:#AAD94C" class="ngde"> 'Alex'</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> date</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">:</span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde"> new</span><span style="color:#6F42C1;--shiki-dark:#FFB454" class="ngde"> Date</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">() }</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">        { id</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">:</span><span style="color:#005CC5;--shiki-dark:#D2A6FF" class="ngde"> 9</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> name</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">:</span><span style="color:#032F62;--shiki-dark:#AAD94C" class="ngde"> 'Ray'</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> date</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">:</span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde"> new</span><span style="color:#6F42C1;--shiki-dark:#FFB454" class="ngde"> Date</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">() }</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">    ]</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">;</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">}</span></span></code></pre>`}]},A=M;var O='<p class="ngde"><code class="ngde ng-doc-code-with-link"><a href="api/classes/ng-core/components/TableComponent" class="ng-doc-code-anchor ngde">v-table</a></code> is an easier-to-use material table</p><ng-doc-demo componentname="DemoComponent" indexable="false" class="ngde"><div id="options" class="ngde">{}</div></ng-doc-demo>',P=(()=>{let s=class s extends r{constructor(){super(),this.pageType="guide",this.pageContent=O,this.editSourceFileUrl="https://github.com/valitydev/ng-libs/edit/master/projects/ng-libs-doc/src/app/components/table/index.md?message=docs(): describe your changes here...",this.viewSourceFileUrl="https://github.com/valitydev/ng-libs/blob/master/projects/ng-libs-doc/src/app/components/table/index.md",this.page=e,this.demoAssets=A}};s.\u0275fac=function(a){return new(a||s)},s.\u0275cmp=l({type:s,selectors:[["ng-doc-page-y4yfa44n"]],standalone:!0,features:[g([{provide:r,useExisting:s},C,e.providers??[]]),B,i],decls:1,vars:0,template:function(a,p){a&1&&o(0,"ng-doc-page")},dependencies:[h],encapsulation:2,changeDetection:0});let n=s;return n})(),R=[t(d({},(0,u.isRoute)(e.route)?e.route:{}),{path:"",component:P,title:"Table"})],J=R;export{P as PageComponent,J as default};
