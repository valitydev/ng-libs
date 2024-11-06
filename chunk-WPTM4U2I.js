import{a as d}from"./chunk-JGOZMBOU.js";import"./chunk-BAEK5B6P.js";import"./chunk-ACSSPQ7R.js";import{a as n}from"./chunk-CWCQGWZN.js";import"./chunk-KZLY3U5Q.js";import"./chunk-D32FDPIX.js";import{Tb as l,Ub as i,Za as o,ha as t,pb as c}from"./chunk-YY7FQGQK.js";import"./chunk-MTNKEJWM.js";var p=`<p class="ng-doc-no-content ngde" indexable="false">No documentation has been provided.</p><h2 id="presentation" href="api/functions/ng-core/components/treeDataItemToInlineDataItem" headinglink="true" class="ngde">Presentation<ng-doc-heading-anchor class="ng-doc-anchor ngde" anchor="presentation"></ng-doc-heading-anchor></h2><pre class="shiki shiki-themes github-light ayu-dark" style="background-color:#fff;--shiki-dark-bg:#0b0e14;color:#24292e;--shiki-dark:#bfbdb6" tabindex="0"><code class="language-typescript"><span class="line"><span style="color:#D73A49;--shiki-dark:#FF8F40" class="ngde">function</span><span style="color:#6F42C1;--shiki-dark:#FFB454" class="ngde"> <a href="api/functions/ng-core/components/treeDataItemToInlineDataItem" class="ng-doc-code-anchor ngde">treeDataItemToInlineDataItem</a></span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">(</span></span>
<span class="line"><span style="color:#E36209;--shiki-dark:#D2A6FF" class="ngde">  item</span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde">:</span><span style="color:#6F42C1;--shiki-dark:#59C2FF" class="ngde"> <a href="api/type-aliases/ng-core/components/TreeDataItem" class="ng-doc-code-anchor ngde">TreeDataItem</a></span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">&#x3C;</span><span style="color:#6F42C1;--shiki-dark:#59C2FF" class="ngde">T</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span><span style="color:#6F42C1;--shiki-dark:#59C2FF" class="ngde"> C</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">></span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">,</span></span>
<span class="line"><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde">)</span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde">:</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> ({ </span><span style="color:#E36209;--shiki-dark:#BFBDB6" class="ngde">child</span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde">:</span><span style="color:#6F42C1;--shiki-dark:#59C2FF" class="ngde"> C</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> } </span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde">|</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> { </span><span style="color:#E36209;--shiki-dark:#BFBDB6" class="ngde">value</span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde">:</span><span style="color:#6F42C1;--shiki-dark:#59C2FF" class="ngde"> T</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">;</span><span style="color:#E36209;--shiki-dark:#BFBDB6" class="ngde"> child</span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde">:</span><span style="color:#6F42C1;--shiki-dark:#59C2FF" class="ngde"> C</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> } </span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde">|</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> { </span><span style="color:#E36209;--shiki-dark:#BFBDB6" class="ngde">value</span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde">:</span><span style="color:#6F42C1;--shiki-dark:#59C2FF" class="ngde"> T</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">;</span><span style="color:#E36209;--shiki-dark:#BFBDB6" class="ngde"> child</span><span style="color:#D73A49;--shiki-dark:#F29668" class="ngde">?:</span><span style="color:#005CC5;--shiki-dark:#39BAE6" class="ngde"> undefined</span><span style="color:#24292E;--shiki-dark:#BFBDB6" class="ngde"> })[]</span><span style="color:#24292E;--shiki-dark:#BFBDB6B3" class="ngde">;</span></span></code></pre><h2 id="returns" href="api/functions/ng-core/components/treeDataItemToInlineDataItem" headinglink="true" class="ngde">Returns<ng-doc-heading-anchor class="ng-doc-anchor ngde" anchor="returns"></ng-doc-heading-anchor></h2><div class="ng-doc-returns ngde"><code indexable="false" class="ngde">({ child: C; } | { value: T; child: C; } | { value: T; child?: undefined; })[]</code></div><h2 id="parameters" href="api/functions/ng-core/components/treeDataItemToInlineDataItem" headinglink="true" class="ngde">Parameters<ng-doc-heading-anchor class="ng-doc-anchor ngde" anchor="parameters"></ng-doc-heading-anchor></h2><div class="ng-doc-table-wrapper ngde"><table class="ng-doc-api-table ngde"><thead class="ngde"><tr indexable="false" class="ngde"><th class="ngde">Name</th><th class="ngde">Type</th><th class="ngde">Description</th></tr></thead><tbody class="ngde"><tr class="ngde"><td indexable="false" class="ngde">item<div class="ng-doc-node-details ngde"></div></td><td class="ngde"><code indexable="false" class="ngde ng-doc-code-with-link"><a href="api/type-aliases/ng-core/components/TreeDataItem" class="ng-doc-code-anchor ngde">TreeDataItem</a>&#x3C;T, C></code></td><td class="ngde"></td></tr></tbody></table></div>`,g=(()=>{let s=class s extends n{constructor(){super(),this.pageType="api",this.pageContent=p,this.editSourceFileUrl="https://github.com/valitydev/ng-libs/edit/master/projects/ng-core/src/lib/components/table/tree-data/tree-data-item-to-inline-data-item.ts?message=docs(): describe your changes here...#L3",this.viewSourceFileUrl="https://github.com/valitydev/ng-libs/blob/master/projects/ng-core/src/lib/components/table/tree-data/tree-data-item-to-inline-data-item.ts#L3"}};s.\u0275fac=function(a){return new(a||s)},s.\u0275cmp=t({type:s,selectors:[["ng-doc-page-00gwl73t"]],standalone:!0,features:[l([{provide:n,useExisting:s}]),o,i],decls:1,vars:0,template:function(a,k){a&1&&c(0,"ng-doc-page")},dependencies:[d],encapsulation:2,changeDetection:0});let e=s;return e})(),h=[{path:"",component:g,title:"treeDataItemToInlineDataItem"}],y=h;export{g as PageComponent,y as default};
