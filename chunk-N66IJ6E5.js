import{a as i}from"./chunk-2P4MOD37.js";import"./chunk-UD2XYXJD.js";import{a}from"./chunk-N2KQ7BRZ.js";import{Bb as c,Cb as o,Pa as t,X as d,bb as l}from"./chunk-VVA3VA7Z.js";import"./chunk-S4BCQQ57.js";var r=`<header class="ngde"><div class="ng-doc-page-tags ngde"><span class="ng-doc-tag ngde" indexable="false" data-content="ng-doc-scope">@vality/ng-core components</span> <span class="ng-doc-inline-delimiter ngde" indexable="false">/</span> <span class="ng-doc-tag ngde" indexable="false" data-content="Class">Class</span> <span class="ng-doc-inline-delimiter ngde" indexable="false">/</span><div class="ng-doc-decorators-group ngde" indexable="false"><code class="ngde">@Component</code></div><span class="ng-doc-inline-delimiter ngde" indexable="false">/</span> <span class="ng-doc-tag ngde" indexable="false" data-content="ng-doc-tag-selector">v-file-upload</span></div><h1 id="fileuploadcomponent" class="ngde">FileUploadComponent<a title="Link to heading" class="ng-doc-header-link ngde" href="/core/api/ng-core/components/classes/FileUploadComponent#fileuploadcomponent"><ng-doc-icon icon="link-2" size="16" class="ngde"></ng-doc-icon></a></h1><!-- This is a hack to make the declaration name available to the search index. --><div style="display: none" class="ngde">%%API_NAME_ANCHOR%%</div></header><section class="ngde"><span class="ng-doc-no-content ngde" indexable="false">No documentation has been provided.</span></section><section class="ngde"><h2 id="constructor" class="ngde">Constructor<a title="Link to heading" class="ng-doc-header-link ngde" href="/core/api/ng-core/components/classes/FileUploadComponent#constructor"><ng-doc-icon icon="link-2" size="16" class="ngde"></ng-doc-icon></a></h2><div class="ng-doc-table-wrapper ngde"><table class="ng-doc-method-table ngde"><tbody class="ngde"><tr class="ngde"><td class="ngde"><span class="ng-doc-no-content ngde" indexable="false">No documentation has been provided.</span></td></tr><tr class="ngde"><td class="ngde"><h5 class="no-anchor ngde" indexable="false">Presentation</h5><pre class="ngde hljs"><code lang="typescript" class="hljs language-typescript code-lines ngde"><span class="line ngde"><span class="hljs-title function_ ngde">constructor</span>(<span class="hljs-params ngde"></span>
</span><span class="line ngde"><span class="hljs-params ngde">	</span><span class="hljs-keyword ngde">private</span><span class="hljs-params ngde"> log: <a href="/core/api/ng-core/services/classes/NotifyLogService" class="ng-doc-code-anchor ngde" data-link-type="Injectable" class="ngde">NotifyLogService</a></span>
</span><span class="line ngde"><span class="hljs-params ngde"></span>): <span class="hljs-title class_ ngde"><a href="/core/api/ng-core/components/classes/FileUploadComponent" class="ng-doc-code-anchor ngde" data-link-type="Component" class="ngde">FileUploadComponent</a></span>;
</span></code></pre></td></tr><tr class="ngde"><td class="ngde"><h5 class="no-anchor ngde" indexable="false">Parameters</h5><div class="ng-doc-table-wrapper ngde"><table class="ng-doc-parameters-table ngde"><thead class="ngde"><tr indexable="false" class="ngde"><th class="ng-doc-parameters-table-name ngde">Name</th><th class="ng-doc-parameters-table-type ngde">Type</th><th class="ng-doc-parameters-table-description ngde">Description</th></tr></thead><tbody class="ngde"><tr data-slug="log" data-slugtype="member" id="log" class="ngde"><td indexable="false" class="ngde">log<div class="ng-doc-node-details ngde"></div></td><td class="ngde"><code indexable="false" class="ngde ng-doc-code-with-link" class="ngde"><a href="/core/api/ng-core/services/classes/NotifyLogService" class="ng-doc-code-anchor ngde" data-link-type="Injectable" class="ngde">NotifyLogService</a></code></td><td class="ngde"></td></tr></tbody></table></div></td></tr></tbody></table></div></section><section class="ngde"><h2 id="properties" class="ngde">Properties<a title="Link to heading" class="ng-doc-header-link ngde" href="/core/api/ng-core/components/classes/FileUploadComponent#properties"><ng-doc-icon icon="link-2" size="16" class="ngde"></ng-doc-icon></a></h2><div class="ng-doc-table-wrapper ngde"><table class="ng-doc-properties-table ngde"><thead class="ngde"><tr indexable="false" class="ngde"><th class="ng-doc-properties-table-name ngde">Name</th><th class="ng-doc-properties-table-type ngde">Type</th><th class="ng-doc-properties-table-description ngde">Description</th></tr></thead><tbody class="ngde"><tr data-slug="extensions" data-slugtype="member" id="extensions" class="ngde"><td indexable="false" class="ngde"><div class="ng-doc-decorators-group column ngde" indexable="false"><code class="ngde">@Input</code></div>extensions<div class="ng-doc-node-details ngde"></div></td><td class="ngde"><code indexable="false" class="ngde">string[]</code></td><td class="ngde"></td></tr><tr data-slug="file" data-slugtype="member" id="file" class="ngde"><td indexable="false" class="ngde"><span class="ng-doc-badge-wrapper ngde" ngdoctooltip="Protected" indexable="false"><span class="ng-doc-badge ngde" indexable="false" data-content="protected">p</span> </span>file<div class="ng-doc-node-details ngde"></div></td><td class="ngde"><code indexable="false" class="ngde">File | null | undefined</code></td><td class="ngde"></td></tr><tr data-slug="label" data-slugtype="member" id="label" class="ngde"><td indexable="false" class="ngde"><div class="ng-doc-decorators-group column ngde" indexable="false"><code class="ngde">@Input</code></div>label<div class="ng-doc-node-details ngde"></div></td><td class="ngde"><code indexable="false" class="ngde">string | undefined</code></td><td class="ngde"></td></tr><tr data-slug="upload" data-slugtype="member" id="upload" class="ngde"><td indexable="false" class="ngde"><div class="ng-doc-decorators-group column ngde" indexable="false"><code class="ngde">@Output</code></div>upload<div class="ng-doc-node-details ngde"></div></td><td class="ngde"><code indexable="false" class="ngde">EventEmitter&#x3C;File | null></code></td><td class="ngde"></td></tr></tbody></table></div></section><section class="ngde"><h2 id="methods" class="ngde">Methods<a title="Link to heading" class="ng-doc-header-link ngde" href="/core/api/ng-core/components/classes/FileUploadComponent#methods"><ng-doc-icon icon="link-2" size="16" class="ngde"></ng-doc-icon></a></h2><div class="ng-doc-table-wrapper ngde"><table class="ng-doc-method-table ngde"><thead class="ngde"><tr class="ngde"><th indexable="false" class="ngde"><h3 data-slugtype="member" id="loadfile" class="ngde">loadFile()<a title="Link to heading" class="ng-doc-header-link ngde" href="/core/api/ng-core/components/classes/FileUploadComponent#loadfile"><ng-doc-icon icon="link-2" size="16" class="ngde"></ng-doc-icon></a></h3><div class="ng-doc-node-details ngde"></div></th></tr></thead><tbody class="ngde"><tr class="ngde"><td class="ngde"><span class="ng-doc-no-content ngde" indexable="false">No documentation has been provided.</span></td></tr><tr class="ngde"><td class="ngde"><h5 class="no-anchor ngde" indexable="false">Presentation</h5><pre class="ngde hljs"><code lang="typescript" class="hljs language-typescript code-lines ngde"><span class="line ngde"><span class="hljs-title function_ ngde">loadFile</span>(<span class="hljs-attr ngde">event</span>: <span class="hljs-title class_ ngde">Event</span>): <span class="hljs-built_in ngde">void</span>;
</span></code></pre></td></tr><tr class="ngde"><td class="ngde"><h5 class="no-anchor ngde" indexable="false">Parameters</h5><div class="ng-doc-table-wrapper ngde"><table class="ng-doc-parameters-table ngde"><thead class="ngde"><tr indexable="false" class="ngde"><th class="ng-doc-parameters-table-name ngde">Name</th><th class="ng-doc-parameters-table-type ngde">Type</th><th class="ng-doc-parameters-table-description ngde">Description</th></tr></thead><tbody class="ngde"><tr class="ngde"><td indexable="false" class="ngde">event<div class="ng-doc-node-details ngde"></div></td><td class="ngde"><code indexable="false" class="ngde">Event</code></td><td class="ngde"></td></tr></tbody></table></div><h5 class="no-anchor ngde" indexable="false">Returns</h5><p class="ngde"><code indexable="false" class="ngde">void</code></p></td></tr></tbody></table></div></section>`,p=(()=>{let e=class e extends a{constructor(){super(),this.routePrefix=void 0,this.pageType="api",this.editSourceFileUrl="https://github.com/valitydev/ng-libs/edit/master/projects/ng-core/src/lib/components/file-upload/file-upload.component.ts?message=docs(ng-core/components): describe your changes here...#L12",this.viewSourceFileUrl="https://github.com/valitydev/ng-libs/blob/master/projects/ng-core/src/lib/components/file-upload/file-upload.component.ts#L12",this.pageContent=r,this.demo=void 0,this.demoAssets=void 0}};e.\u0275fac=function(n){return new(n||e)},e.\u0275cmp=d({type:e,selectors:[["ng-doc-page-core-api-ng-core-components-classes-file-upload-component"]],standalone:!0,features:[c([{provide:a,useExisting:e}]),t,o],decls:1,vars:0,template:function(n,b){n&1&&l(0,"ng-doc-page")},dependencies:[i],encapsulation:2,changeDetection:0});let s=e;return s})(),h=[{path:"",component:p,title:"FileUploadComponent"}],u=h;export{p as DynamicComponent,u as default};
