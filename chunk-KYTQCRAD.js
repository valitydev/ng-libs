import{a as F,b as R,d as M,e as N,f as U,g as j,h as A,i as _,j as B,m as H,n as V,o as W,p as q}from"./chunk-UFUX5MSD.js";import{a as G}from"./chunk-CG5IWX3Y.js";import{a as P}from"./chunk-I4ECEPIG.js";import{d as k,l as L,s as p}from"./chunk-2QO75U7C.js";import{b as $}from"./chunk-7AKA3UWP.js";import{O as s,R as C,h as O,va as D}from"./chunk-Q4D4R4J6.js";import{n as S}from"./chunk-MTNKEJWM.js";function m(e){var t={options:{directed:e.isDirected(),multigraph:e.isMultigraph(),compound:e.isCompound()},nodes:et(e),edges:nt(e)};return p(e.graph())||(t.value=k(e.graph())),t}function et(e){return L(e.nodes(),function(t){var n=e.node(t),r=e.parent(t),i={v:t};return p(n)||(i.value=n),p(r)||(i.parent=r),i})}function nt(e){return L(e.edges(),function(t){var n=e.edge(t),r={v:t.v,w:t.w};return p(t.name)||(r.name=t.name),p(n)||(r.value=n),r})}var l={},g={},z={},st=()=>{g={},z={},l={}},T=(e,t)=>(s.trace("In isDescendant",t," ",e," = ",g[t].includes(e)),!!g[t].includes(e)),rt=(e,t)=>(s.info("Descendants of ",t," is ",g[t]),s.info("Edge is ",e),e.v===t||e.w===t?!1:g[t]?g[t].includes(e.v)||T(e.v,t)||T(e.w,t)||g[t].includes(e.w):(s.debug("Tilt, ",t,",not in descendants"),!1)),K=(e,t,n,r)=>{s.warn("Copying children of ",e,"root",r,"data",t.node(e),r);let i=t.children(e)||[];e!==r&&i.push(e),s.warn("Copying (nodes) clusterId",e,"nodes",i),i.forEach(a=>{if(t.children(a).length>0)K(a,t,n,r);else{let d=t.node(a);s.info("cp ",a," to ",r," with parent ",e),n.setNode(a,d),r!==t.parent(a)&&(s.warn("Setting parent",a,t.parent(a)),n.setParent(a,t.parent(a))),e!==r&&a!==e?(s.debug("Setting parent",a,e),n.setParent(a,e)):(s.info("In copy ",e,"root",r,"data",t.node(e),r),s.debug("Not Setting parent for node=",a,"cluster!==rootId",e!==r,"node!==clusterId",a!==e));let h=t.edges(a);s.debug("Copying Edges",h),h.forEach(f=>{s.info("Edge",f);let u=t.edge(f.v,f.w,f.name);s.info("Edge data",u,r);try{rt(f,r)?(s.info("Copying as ",f.v,f.w,u,f.name),n.setEdge(f.v,f.w,u,f.name),s.info("newGraph edges ",n.edges(),n.edge(n.edges()[0]))):s.info("Skipping copy of edge ",f.v,"-->",f.w," rootId: ",r," clusterId:",e)}catch(w){s.error(w)}})}s.debug("Removing node",a),t.removeNode(a)})},Q=(e,t)=>{let n=t.children(e),r=[...n];for(let i of n)z[i]=e,r=[...r,...Q(i,t)];return r},X=(e,t)=>{s.trace("Searching",e);let n=t.children(e);if(s.trace("Searching children of id ",e,n),n.length<1)return s.trace("This is a valid node",e),e;for(let r of n){let i=X(r,t);if(i)return s.trace("Found replacement for",e," => ",i),i}},J=e=>!l[e]||!l[e].externalConnections?e:l[e]?l[e].id:e,at=(e,t)=>{if(!e||t>10){s.debug("Opting out, no graph ");return}else s.debug("Opting in, graph ");e.nodes().forEach(function(n){e.children(n).length>0&&(s.warn("Cluster identified",n," Replacement id in edges: ",X(n,e)),g[n]=Q(n,e),l[n]={id:X(n,e),clusterData:e.node(n)})}),e.nodes().forEach(function(n){let r=e.children(n),i=e.edges();r.length>0?(s.debug("Cluster identified",n,g),i.forEach(a=>{if(a.v!==n&&a.w!==n){let d=T(a.v,n),h=T(a.w,n);d^h&&(s.warn("Edge: ",a," leaves cluster ",n),s.warn("Descendants of XXX ",n,": ",g[n]),l[n].externalConnections=!0)}})):s.debug("Not a cluster ",n,g)});for(let n of Object.keys(l)){let r=l[n].id,i=e.parent(r);i!==n&&l[i]&&!l[i].externalConnections&&(l[n].id=i)}e.edges().forEach(function(n){let r=e.edge(n);s.warn("Edge "+n.v+" -> "+n.w+": "+JSON.stringify(n)),s.warn("Edge "+n.v+" -> "+n.w+": "+JSON.stringify(e.edge(n)));let i=n.v,a=n.w;if(s.warn("Fix XXX",l,"ids:",n.v,n.w,"Translating: ",l[n.v]," --- ",l[n.w]),l[n.v]&&l[n.w]&&l[n.v]===l[n.w]){s.warn("Fixing and trixing link to self - removing XXX",n.v,n.w,n.name),s.warn("Fixing and trixing - removing XXX",n.v,n.w,n.name),i=J(n.v),a=J(n.w),e.removeEdge(n.v,n.w,n.name);let d=n.w+"---"+n.v;e.setNode(d,{domId:d,id:d,labelStyle:"",labelText:r.label,padding:0,shape:"labelRect",style:""});let h=structuredClone(r),f=structuredClone(r);h.label="",h.arrowTypeEnd="none",f.label="",h.fromCluster=n.v,f.toCluster=n.v,e.setEdge(i,d,h,n.name+"-cyclic-special"),e.setEdge(d,a,f,n.name+"-cyclic-special")}else if(l[n.v]||l[n.w]){if(s.warn("Fixing and trixing - removing XXX",n.v,n.w,n.name),i=J(n.v),a=J(n.w),e.removeEdge(n.v,n.w,n.name),i!==n.v){let d=e.parent(i);l[d].externalConnections=!0,r.fromCluster=n.v}if(a!==n.w){let d=e.parent(a);l[d].externalConnections=!0,r.toCluster=n.w}s.warn("Fix Replacing with XXX",i,a,n.name),e.setEdge(i,a,r,n.name)}}),s.warn("Adjusted Graph",m(e)),Y(e,0),s.trace(l)},Y=(e,t)=>{if(s.warn("extractor - ",t,m(e),e.children("D")),t>10){s.error("Bailing out");return}let n=e.nodes(),r=!1;for(let i of n){let a=e.children(i);r=r||a.length>0}if(!r){s.debug("Done, no node has children",e.nodes());return}s.debug("Nodes = ",n,t);for(let i of n)if(s.debug("Extracting node",i,l,l[i]&&!l[i].externalConnections,!e.parent(i),e.node(i),e.children("D")," Depth ",t),!l[i])s.debug("Not a cluster",i,t);else if(!l[i].externalConnections&&e.children(i)&&e.children(i).length>0){s.warn("Cluster without external connections, without a parent and with children",i,t);let d=e.graph().rankdir==="TB"?"LR":"TB";l[i]&&l[i].clusterData&&l[i].clusterData.dir&&(d=l[i].clusterData.dir,s.warn("Fixing dir",l[i].clusterData.dir,d));let h=new P({multigraph:!0,compound:!0}).setGraph({rankdir:d,nodesep:50,ranksep:50,marginx:8,marginy:8}).setDefaultEdgeLabel(function(){return{}});s.warn("Old graph before copy",m(e)),K(i,e,h,i),e.setNode(i,{clusterNode:!0,id:i,clusterData:l[i].clusterData,labelText:l[i].labelText,graph:h}),s.warn("New graph after copy node: (",i,")",m(h)),s.debug("Old graph after copy",m(e))}else s.warn("Cluster ** ",i," **not meeting the criteria !externalConnections:",!l[i].externalConnections," no parent: ",!e.parent(i)," children ",e.children(i)&&e.children(i).length>0,e.children("D"),t),s.debug(l);n=e.nodes(),s.warn("New list of nodes",n);for(let i of n){let a=e.node(i);s.warn(" Now next level",i,a),a.clusterNode&&Y(a.graph,t+1)}},Z=(e,t)=>{if(t.length===0)return[];let n=Object.assign(t);return t.forEach(r=>{let i=e.children(r),a=Z(e,i);n=[...n,...a]}),n},ct=e=>Z(e,e.children()),ot=(e,t)=>{s.info("Creating subgraph rect for ",t.id,t);let n=D(),r=e.insert("g").attr("class","cluster"+(t.class?" "+t.class:"")).attr("id",t.id),i=r.insert("rect",":first-child"),a=C(n.flowchart.htmlLabels),d=r.insert("g").attr("class","cluster-label"),h=t.labelType==="markdown"?$(d,t.labelText,{style:t.labelStyle,useHtmlLabels:a}):d.node().appendChild(R(t.labelText,t.labelStyle,void 0,!0)),f=h.getBBox();if(C(n.flowchart.htmlLabels)){let c=h.children[0],o=O(h);f=c.getBoundingClientRect(),o.attr("width",f.width),o.attr("height",f.height)}let u=0*t.padding,w=u/2,b=t.width<=f.width+u?f.width+u:t.width;t.width<=f.width+u?t.diff=(f.width-t.width)/2-t.padding/2:t.diff=-t.padding/2,s.trace("Data ",t,JSON.stringify(t)),i.attr("style",t.style).attr("rx",t.rx).attr("ry",t.ry).attr("x",t.x-b/2).attr("y",t.y-t.height/2-w).attr("width",b).attr("height",t.height+u);let{subGraphTitleTopMargin:y}=B(n);a?d.attr("transform",`translate(${t.x-f.width/2}, ${t.y-t.height/2+y})`):d.attr("transform",`translate(${t.x}, ${t.y-t.height/2+y})`);let v=i.node().getBBox();return t.width=v.width,t.height=v.height,t.intersect=function(c){return N(t,c)},r},lt=(e,t)=>{let n=e.insert("g").attr("class","note-cluster").attr("id",t.id),r=n.insert("rect",":first-child"),i=0*t.padding,a=i/2;r.attr("rx",t.rx).attr("ry",t.ry).attr("x",t.x-t.width/2-a).attr("y",t.y-t.height/2-a).attr("width",t.width+i).attr("height",t.height+i).attr("fill","none");let d=r.node().getBBox();return t.width=d.width,t.height=d.height,t.intersect=function(h){return N(t,h)},n},ft=(e,t)=>{let n=D(),r=e.insert("g").attr("class",t.classes).attr("id",t.id),i=r.insert("rect",":first-child"),a=r.insert("g").attr("class","cluster-label"),d=r.append("rect"),h=a.node().appendChild(R(t.labelText,t.labelStyle,void 0,!0)),f=h.getBBox();if(C(n.flowchart.htmlLabels)){let c=h.children[0],o=O(h);f=c.getBoundingClientRect(),o.attr("width",f.width),o.attr("height",f.height)}f=h.getBBox();let u=0*t.padding,w=u/2,b=t.width<=f.width+t.padding?f.width+t.padding:t.width;t.width<=f.width+t.padding?t.diff=(f.width+t.padding*0-t.width)/2:t.diff=-t.padding/2,i.attr("class","outer").attr("x",t.x-b/2-w).attr("y",t.y-t.height/2-w).attr("width",b+u).attr("height",t.height+u),d.attr("class","inner").attr("x",t.x-b/2-w).attr("y",t.y-t.height/2-w+f.height-1).attr("width",b+u).attr("height",t.height+u-f.height-3);let{subGraphTitleTopMargin:y}=B(n);a.attr("transform",`translate(${t.x-f.width/2}, ${t.y-t.height/2-t.padding/3+(C(n.flowchart.htmlLabels)?5:3)+y})`);let v=i.node().getBBox();return t.height=v.height,t.intersect=function(c){return N(t,c)},r},dt=(e,t)=>{let n=e.insert("g").attr("class",t.classes).attr("id",t.id),r=n.insert("rect",":first-child"),i=0*t.padding,a=i/2;r.attr("class","divider").attr("x",t.x-t.width/2-a).attr("y",t.y-t.height/2).attr("width",t.width+i).attr("height",t.height+i);let d=r.node().getBBox();return t.width=d.width,t.height=d.height,t.diff=-t.padding/2,t.intersect=function(h){return N(t,h)},n},ht={rect:ot,roundedWithTitle:ft,noteGroup:lt,divider:dt},I={},ut=(e,t)=>{s.trace("Inserting cluster");let n=t.shape||"rect";I[t.id]=ht[n](e,t)},gt=()=>{I={}},tt=(e,t,n,r,i,a)=>S(void 0,null,function*(){s.info("Graph in recursive render: XXX",m(t),i);let d=t.graph().rankdir;s.trace("Dir in recursive render - dir:",d);let h=e.insert("g").attr("class","root");t.nodes()?s.info("Recursive render XXX",t.nodes()):s.info("No nodes found for",t),t.edges().length>0&&s.trace("Recursive edges",t.edge(t.edges()[0]));let f=h.insert("g").attr("class","clusters"),u=h.insert("g").attr("class","edgePaths"),w=h.insert("g").attr("class","edgeLabels"),b=h.insert("g").attr("class","nodes");yield Promise.all(t.nodes().map(function(c){return S(this,null,function*(){let o=t.node(c);if(i!==void 0){let x=JSON.parse(JSON.stringify(i.clusterData));s.info("Setting data for cluster XXX (",c,") ",x,i),t.setNode(i.id,x),t.parent(c)||(s.trace("Setting parent",c,i.id),t.setParent(c,i.id,x))}if(s.info("(Insert) Node XXX"+c+": "+JSON.stringify(t.node(c))),o&&o.clusterNode){s.info("Cluster identified",c,o.width,t.node(c));let x=yield tt(b,o.graph,n,r,t.node(c),a),E=x.elem;M(o,E),o.diff=x.diff||0,s.info("Node bounds (abc123)",c,o,o.width,o.x,o.y),j(E,o),s.warn("Recursive render complete ",E,o)}else t.children(c).length>0?(s.info("Cluster - the non recursive path XXX",c,o.id,o,t),s.info(X(o.id,t)),l[o.id]={id:X(o.id,t),node:o}):(s.info("Node - the non recursive path",c,o.id,o),yield U(b,t.node(c),d))})})),t.edges().forEach(function(c){let o=t.edge(c.v,c.w,c.name);s.info("Edge "+c.v+" -> "+c.w+": "+JSON.stringify(c)),s.info("Edge "+c.v+" -> "+c.w+": ",c," ",JSON.stringify(t.edge(c))),s.info("Fix",l,"ids:",c.v,c.w,"Translating: ",l[c.v],l[c.w]),V(w,o)}),t.edges().forEach(function(c){s.info("Edge "+c.v+" -> "+c.w+": "+JSON.stringify(c))}),s.info("#############################################"),s.info("###                Layout                 ###"),s.info("#############################################"),s.info(t),G(t),s.info("Graph after layout:",m(t));let y=0,{subGraphTitleTotalMargin:v}=B(a);return ct(t).forEach(function(c){let o=t.node(c);s.info("Position "+c+": "+JSON.stringify(t.node(c))),s.info("Position "+c+": ("+o.x,","+o.y,") width: ",o.width," height: ",o.height),o&&o.clusterNode?(o.y+=v,_(o)):t.children(c).length>0?(o.height+=v,ut(f,o),l[o.id].node=o):(o.y+=v/2,_(o))}),t.edges().forEach(function(c){let o=t.edge(c);s.info("Edge "+c.v+" -> "+c.w+": "+JSON.stringify(o),o),o.points.forEach(E=>E.y+=v/2);let x=q(u,c,o,l,n,t,r);W(o,x)}),t.nodes().forEach(function(c){let o=t.node(c);s.info(c,o.type,o.diff),o.type==="group"&&(y=o.diff)}),{elem:h,diff:y}}),Ct=(e,t,n,r,i)=>S(void 0,null,function*(){F(e,n,r,i),A(),H(),gt(),st(),s.warn("Graph at first:",JSON.stringify(m(t))),at(t),s.warn("Graph after:",JSON.stringify(m(t)));let a=D();yield tt(e,t,r,i,void 0,a)});export{Ct as a};
