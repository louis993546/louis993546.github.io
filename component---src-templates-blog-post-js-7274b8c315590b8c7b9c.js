(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{"6Gk8":function(e,t,a){"use strict";var r=a("q1tI"),i=a.n(r),n=a("Wbzz"),s=a("9Hrx");function l(e){var t=[],a=[];return e.forEach((function(e){return(e.media?t:a).push(e)})),[].concat(t,a)}function c(e){return e.map((function(e){var t=e.src,a=e.srcSet,r=e.srcSetWebp,n=e.media,s=e.sizes;return i.a.createElement(i.a.Fragment,{key:t},r&&i.a.createElement("source",{type:"image/webp",media:n,srcSet:r,sizes:s}),i.a.createElement("source",{media:n,srcSet:a,sizes:s}))}))}function o(e){return e.map((function(e){var t=e.src,a=e.media,r=e.tracedSVG;return i.a.createElement("source",{key:t,media:a,srcSet:r})}))}function d(e){return e.map((function(e){var t=e.src,a=e.media,r=e.base64;return i.a.createElement("source",{key:t,media:a,srcSet:r})}))}var m=function(e){var t=e.src,a=e.imageVariants,r=e.generateSources,n=e.spreadProps,s=e.ariaHidden,l=i.a.createElement(u,Object.assign({src:t},n,{ariaHidden:s}));return a.length>1?i.a.createElement("picture",null,r(a),l):l},u=i.a.forwardRef((function(e,t){var a=e.sizes,r=e.srcSet,n=e.src,s=e.style,l=e.loading,c=e.draggable,o=e.ariaHidden,d=e.alt,m=function(e,t){if(null==e)return{};var a,r,i={},n=Object.keys(e);for(r=0;r<n.length;r++)a=n[r],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,["sizes","srcSet","src","style","loading","draggable","ariaHidden","alt"]);return i.a.createElement("img",Object.assign({"aria-hidden":o,sizes:a,srcSet:r,src:n,alt:d},m,{ref:t,loading:l,draggable:c,style:Object.assign({position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"},s)}))})),g=function(e){function t(){return e.apply(this,arguments)||this}return Object(s.a)(t,e),t.prototype.render=function(){var e,t,a,r,n,s=(e=this.props,t=Object.assign({},e),a=t.resolutions,r=t.sizes,n=t.critical,a&&(t.fixed=a,delete t.resolutions),r&&(t.fluid=r,delete t.sizes),n&&(t.loading="eager"),t.fluid&&(t.fluid=l([].concat(t.fluid))),t.fixed&&(t.fixed=l([].concat(t.fixed))),t),g=s.title,p=s.alt,f=s.className,y=s.style,b=void 0===y?{}:y,h=s.imgStyle,E=void 0===h?{}:h,S=s.placeholderStyle,v=void 0===S?{}:S,w=s.placeholderClassName,O=s.fluid,j=s.fixed,x=s.Tag,z=s.itemProp,k=s.loading,H=s.draggable,P=Object.assign({},E),V={title:g,alt:"",style:Object.assign({},E,v),className:w,itemProp:z};if(O){var N=O,B=O[0];return i.a.createElement(x,{className:(f||"")+" gatsby-image-wrapper",style:Object.assign({position:"relative",overflow:"hidden"},b),key:"fluid-"+JSON.stringify(B.srcSet)},i.a.createElement(x,{"aria-hidden":!0,style:{width:"100%",paddingBottom:100/B.aspectRatio+"%"}}),B.base64&&i.a.createElement(m,{ariaHidden:!0,src:B.base64,spreadProps:V,imageVariants:N,generateSources:d}),B.tracedSVG&&i.a.createElement(m,{ariaHidden:!0,src:B.tracedSVG,spreadProps:V,imageVariants:N,generateSources:o}),i.a.createElement("picture",null,c(N),i.a.createElement(u,{alt:p,title:g,sizes:B.sizes,src:B.src,crossOrigin:this.props.crossOrigin,srcSet:B.srcSet,style:P,ref:this.imageRef,itemProp:z,loading:k,draggable:H})))}if(j){var G=j,R=j[0],W=Object.assign({position:"relative",overflow:"hidden",display:"inline-block",width:R.width,height:R.height},b);return"inherit"===b.display&&delete W.display,i.a.createElement(x,{className:(f||"")+" gatsby-image-wrapper",style:W,key:"fixed-"+JSON.stringify(R.srcSet)},R.base64&&i.a.createElement(m,{ariaHidden:!0,src:R.base64,spreadProps:V,imageVariants:G,generateSources:d}),R.tracedSVG&&i.a.createElement(m,{ariaHidden:!0,src:R.tracedSVG,spreadProps:V,imageVariants:G,generateSources:o}),i.a.createElement("picture",null,c(G),i.a.createElement(u,{alt:p,title:g,width:R.width,height:R.height,sizes:R.sizes,src:R.src,crossOrigin:this.props.crossOrigin,srcSet:R.srcSet,style:P,itemProp:z,loading:k,draggable:H})))}return null},t}(i.a.Component);g.defaultProps={fadeIn:!0,alt:"",Tag:"div",loading:"lazy"};var p=g,f=a("p3AD");t.a=function(){var e=Object(n.useStaticQuery)("4138022990"),t=e.site.siteMetadata,a=t.author,r=t.social;return i.a.createElement("div",{style:{display:"flex",marginBottom:Object(f.a)(2.5)}},i.a.createElement(p,{fixed:e.avatar.childImageSharp.fixed,alt:a.name,style:{marginRight:Object(f.a)(.5),marginBottom:0,minWidth:50,borderRadius:"100%"},imgStyle:{borderRadius:"50%"}}),i.a.createElement("p",null,"Written by ",i.a.createElement("strong",null,a.name)," ",a.summary," ",i.a.createElement("a",{href:"https://twitter.com/"+r.twitter},"He spends way too much time on Twitter")))}},yZlL:function(e,t,a){"use strict";a.r(t),a.d(t,"pageQuery",(function(){return d}));var r=a("q1tI"),i=a.n(r),n=a("Wbzz"),s=a("6Gk8"),l=a("Bl7J"),c=a("vrFN"),o=a("p3AD");t.default=function(e){var t=e.data,a=e.pageContext,r=e.location,d=t.markdownRemark,m=t.site.siteMetadata.title,u=a.previous,g=a.next;return i.a.createElement(l.a,{location:r,title:m},i.a.createElement(c.a,{title:d.frontmatter.title,description:d.frontmatter.description||d.excerpt}),i.a.createElement("article",null,i.a.createElement("header",null,i.a.createElement("h1",{style:{marginTop:Object(o.a)(1),marginBottom:0}},d.frontmatter.title),i.a.createElement("p",{style:Object.assign({},Object(o.b)(-.2),{display:"block",marginBottom:Object(o.a)(1)})},d.frontmatter.date)),i.a.createElement("section",{dangerouslySetInnerHTML:{__html:d.html}}),i.a.createElement("hr",{style:{marginBottom:Object(o.a)(1)}}),i.a.createElement("footer",null,i.a.createElement(s.a,null))),i.a.createElement("nav",null,i.a.createElement("ul",{style:{display:"flex",flexWrap:"wrap",justifyContent:"space-between",listStyle:"none",padding:0}},i.a.createElement("li",null,u&&i.a.createElement(n.Link,{to:u.fields.slug,rel:"prev"},"← ",u.frontmatter.title)),i.a.createElement("li",null,g&&i.a.createElement(n.Link,{to:g.fields.slug,rel:"next"},g.frontmatter.title," →")))))};var d="10472337"}}]);
//# sourceMappingURL=component---src-templates-blog-post-js-7274b8c315590b8c7b9c.js.map