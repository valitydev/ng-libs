import{a as i}from"./chunk-2P4MOD37.js";import"./chunk-UD2XYXJD.js";import{a as n}from"./chunk-N2KQ7BRZ.js";import{Bb as c,Cb as o,Pa as d,X as l,bb as t}from"./chunk-VVA3VA7Z.js";import"./chunk-S4BCQQ57.js";var p=`<header class="ngde"><div class="ng-doc-page-tags ngde"><span class="ng-doc-tag ngde" indexable="false" data-content="ng-doc-scope">@vality/ng-core components</span> <span class="ng-doc-inline-delimiter ngde" indexable="false">/</span> <span class="ng-doc-tag ngde" indexable="false" data-content="Class">Class</span> <span class="ng-doc-inline-delimiter ngde" indexable="false">/</span><div class="ng-doc-decorators-group ngde" indexable="false"><code class="ngde">@Injectable</code></div></div><h1 id="dialogservice" class="ngde">DialogService<a title="Link to heading" class="ng-doc-header-link ngde" href="/core/api/ng-core/components/classes/DialogService#dialogservice"><ng-doc-icon icon="link-2" size="16" class="ngde"></ng-doc-icon></a></h1><!-- This is a hack to make the declaration name available to the search index. --><div style="display: none" class="ngde">%%API_NAME_ANCHOR%%</div></header><section class="ngde"><span class="ng-doc-no-content ngde" indexable="false">No documentation has been provided.</span></section><section class="ngde"><h2 id="constructor" class="ngde">Constructor<a title="Link to heading" class="ng-doc-header-link ngde" href="/core/api/ng-core/components/classes/DialogService#constructor"><ng-doc-icon icon="link-2" size="16" class="ngde"></ng-doc-icon></a></h2><div class="ng-doc-table-wrapper ngde"><table class="ng-doc-method-table ngde"><tbody class="ngde"><tr class="ngde"><td class="ngde"><span class="ng-doc-no-content ngde" indexable="false">No documentation has been provided.</span></td></tr><tr class="ngde"><td class="ngde"><h5 class="no-anchor ngde" indexable="false">Presentation</h5><pre class="ngde hljs"><code lang="typescript" class="hljs language-typescript code-lines ngde"><span class="line ngde"><span class="hljs-title function_ ngde">constructor</span>(<span class="hljs-params ngde"></span>
</span><span class="line ngde"><span class="hljs-params ngde">	</span><span class="hljs-keyword ngde">private</span><span class="hljs-params ngde"> dialog: MatDialog, </span>
</span><span class="line ngde"><span class="hljs-params ngde">	</span><span class="hljs-meta ngde">@Optional</span>() <span class="hljs-meta ngde">@Inject</span>() <span class="hljs-keyword ngde">private</span> <span class="hljs-keyword ngde">readonly</span><span class="hljs-params ngde"> dialogConfig: <a href="/core/api/ng-core/components/type-aliases/DialogConfig" class="ng-doc-code-anchor ngde" data-link-type="TypeAlias" class="ngde">DialogConfig</a></span>
</span><span class="line ngde"><span class="hljs-params ngde"></span>): <span class="hljs-title class_ ngde"><a href="/core/api/ng-core/components/classes/DialogService" class="ng-doc-code-anchor ngde" data-link-type="Injectable" class="ngde">DialogService</a></span>;
</span></code></pre></td></tr><tr class="ngde"><td class="ngde"><h5 class="no-anchor ngde" indexable="false">Parameters</h5><div class="ng-doc-table-wrapper ngde"><table class="ng-doc-parameters-table ngde"><thead class="ngde"><tr indexable="false" class="ngde"><th class="ng-doc-parameters-table-name ngde">Name</th><th class="ng-doc-parameters-table-type ngde">Type</th><th class="ng-doc-parameters-table-description ngde">Description</th></tr></thead><tbody class="ngde"><tr data-slug="dialog" data-slugtype="member" id="dialog" class="ngde"><td indexable="false" class="ngde">dialog<div class="ng-doc-node-details ngde"></div></td><td class="ngde"><code indexable="false" class="ngde">MatDialog</code></td><td class="ngde"></td></tr><tr data-slug="dialogConfig" data-slugtype="member" id="dialogConfig" class="ngde"><td indexable="false" class="ngde"><div class="ng-doc-decorators-group column ngde" indexable="false"><code class="ngde">@Optional</code> <code class="ngde">@Inject</code></div><span class="ng-doc-badge-wrapper ngde" ngdoctooltip="Readonly" indexable="false"><span class="ng-doc-badge ngde" indexable="false" data-content="readonly">r</span> </span>dialogConfig<div class="ng-doc-node-details ngde"></div></td><td class="ngde"><code indexable="false" class="ngde ng-doc-code-with-link" class="ngde"><a href="/core/api/ng-core/components/type-aliases/DialogConfig" class="ng-doc-code-anchor ngde" data-link-type="TypeAlias" class="ngde">DialogConfig</a></code></td><td class="ngde"></td></tr></tbody></table></div></td></tr></tbody></table></div></section><section class="ngde"><h2 id="methods" class="ngde">Methods<a title="Link to heading" class="ng-doc-header-link ngde" href="/core/api/ng-core/components/classes/DialogService#methods"><ng-doc-icon icon="link-2" size="16" class="ngde"></ng-doc-icon></a></h2><div class="ng-doc-table-wrapper ngde"><table class="ng-doc-method-table ngde"><thead class="ngde"><tr class="ngde"><th indexable="false" class="ngde"><h3 data-slugtype="member" id="open" class="ngde">open()<a title="Link to heading" class="ng-doc-header-link ngde" href="/core/api/ng-core/components/classes/DialogService#open"><ng-doc-icon icon="link-2" size="16" class="ngde"></ng-doc-icon></a></h3><div class="ng-doc-node-details ngde"></div></th></tr></thead><tbody class="ngde"><tr class="ngde"><td class="ngde"><span class="ng-doc-no-content ngde" indexable="false">No documentation has been provided.</span></td></tr><tr class="ngde"><td class="ngde"><h5 class="no-anchor ngde" indexable="false">Presentation</h5><pre class="ngde hljs"><code lang="typescript" class="hljs language-typescript code-lines ngde"><span class="line ngde"><span class="hljs-title function_ ngde">open</span>(<span class="hljs-attr ngde">dialogComponent</span>: <span class="hljs-title class_ ngde">ComponentType</span>&#x3C;<span class="hljs-title class_ ngde"><a href="/core/api/ng-core/components/classes/DialogSuperclass" class="ng-doc-code-anchor ngde" data-link-type="Directive" class="ngde">DialogSuperclass</a></span>&#x3C;<span class="hljs-title class_ ngde">TDialogComponent</span>, <span class="hljs-title class_ ngde">TDialogData</span>, <span class="hljs-title class_ ngde">TDialogResponseData</span>, <span class="hljs-title class_ ngde">TDialogResponseStatus</span>>>, [data, configOrConfigName]: <span class="hljs-title class_ ngde">TDialogData</span> <span class="hljs-keyword ngde">extends</span> <span class="hljs-built_in ngde">void</span> ? [] : [<span class="hljs-attr ngde">data</span>: <span class="hljs-title class_ ngde">TDialogData</span>, configOrConfigName?: <span class="hljs-string ngde">"small"</span> | <span class="hljs-string ngde">"medium"</span> | <span class="hljs-string ngde">"large"</span> | <span class="hljs-title class_ ngde">Omit</span>&#x3C;<span class="hljs-title class_ ngde">MatDialogConfig</span>&#x3C;<span class="hljs-title class_ ngde">TDialogData</span>>, <span class="hljs-string ngde">"data"</span>> | <span class="hljs-literal ngde">undefined</span>]): <span class="hljs-title class_ ngde">MatDialogRef</span>&#x3C;<span class="hljs-title class_ ngde">TDialogComponent</span>, <span class="hljs-title class_ ngde"><a href="/core/api/ng-core/components/interfaces/DialogResponse" class="ng-doc-code-anchor ngde" data-link-type="Interface" class="ngde">DialogResponse</a></span>&#x3C;<span class="hljs-title class_ ngde">TDialogResponseData</span>, <span class="hljs-title class_ ngde">TDialogResponseStatus</span>>>;
</span></code></pre></td></tr><tr class="ngde"><td class="ngde"><h5 class="no-anchor ngde" indexable="false">Parameters</h5><div class="ng-doc-table-wrapper ngde"><table class="ng-doc-parameters-table ngde"><thead class="ngde"><tr indexable="false" class="ngde"><th class="ng-doc-parameters-table-name ngde">Name</th><th class="ng-doc-parameters-table-type ngde">Type</th><th class="ng-doc-parameters-table-description ngde">Description</th></tr></thead><tbody class="ngde"><tr class="ngde"><td indexable="false" class="ngde">dialogComponent<div class="ng-doc-node-details ngde"></div></td><td class="ngde"><code indexable="false" class="ngde">ComponentType&#x3C;DialogSuperclass&#x3C;TDialogComponent, TDialogData, TDialogResponseData, TDialogResponseStatus>></code></td><td class="ngde"></td></tr><tr class="ngde"><td indexable="false" class="ngde">[data, configOrConfigName]<div class="ng-doc-node-details ngde"></div></td><td class="ngde"><code indexable="false" class="ngde">TDialogData extends void ? [] : [data: TDialogData, configOrConfigName?: "small" | "medium" | "large" | Omit&#x3C;MatDialogConfig&#x3C;TDialogData>, "data"> | undefined]</code></td><td class="ngde"></td></tr></tbody></table></div><h5 class="no-anchor ngde" indexable="false">Returns</h5><p class="ngde"><code indexable="false" class="ngde">MatDialogRef&#x3C;TDialogComponent, DialogResponse&#x3C;TDialogResponseData, TDialogResponseStatus>></code></p></td></tr></tbody></table></div></section>`,r=(()=>{let e=class e extends n{constructor(){super(),this.routePrefix=void 0,this.pageType="api",this.editSourceFileUrl="https://github.com/valitydev/ng-libs/edit/master/projects/ng-core/src/lib/components/dialog/services/dialog.service.ts?message=docs(ng-core/components): describe your changes here...#L9",this.viewSourceFileUrl="https://github.com/valitydev/ng-libs/blob/master/projects/ng-core/src/lib/components/dialog/services/dialog.service.ts#L9",this.pageContent=p,this.demo=void 0,this.demoAssets=void 0}};e.\u0275fac=function(a){return new(a||e)},e.\u0275cmp=l({type:e,selectors:[["ng-doc-page-core-api-ng-core-components-classes-dialog-service"]],standalone:!0,features:[c([{provide:n,useExisting:e}]),d,o],decls:1,vars:0,template:function(a,m){a&1&&t(0,"ng-doc-page")},dependencies:[i],encapsulation:2,changeDetection:0});let s=e;return s})(),h=[{path:"",component:r,title:"DialogService"}],D=h;export{r as DynamicComponent,D as default};
