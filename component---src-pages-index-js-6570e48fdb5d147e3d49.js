(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{"6Gk8":function(e,t,a){"use strict";var r=a("q1tI"),i=a.n(r),n=a("Wbzz"),s=a("9Hrx");function l(e){var t=[],a=[];return e.forEach((function(e){return(e.media?t:a).push(e)})),[].concat(t,a)}function c(e){return e.map((function(e){var t=e.src,a=e.srcSet,r=e.srcSetWebp,n=e.media,s=e.sizes;return i.a.createElement(i.a.Fragment,{key:t},r&&i.a.createElement("source",{type:"image/webp",media:n,srcSet:r,sizes:s}),i.a.createElement("source",{media:n,srcSet:a,sizes:s}))}))}function o(e){return e.map((function(e){var t=e.src,a=e.media,r=e.tracedSVG;return i.a.createElement("source",{key:t,media:a,srcSet:r})}))}function d(e){return e.map((function(e){var t=e.src,a=e.media,r=e.base64;return i.a.createElement("source",{key:t,media:a,srcSet:r})}))}var m=function(e){var t=e.src,a=e.imageVariants,r=e.generateSources,n=e.spreadProps,s=e.ariaHidden,l=i.a.createElement(u,Object.assign({src:t},n,{ariaHidden:s}));return a.length>1?i.a.createElement("picture",null,r(a),l):l},u=i.a.forwardRef((function(e,t){var a=e.sizes,r=e.srcSet,n=e.src,s=e.style,l=e.loading,c=e.draggable,o=e.ariaHidden,d=e.alt,m=function(e,t){if(null==e)return{};var a,r,i={},n=Object.keys(e);for(r=0;r<n.length;r++)a=n[r],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,["sizes","srcSet","src","style","loading","draggable","ariaHidden","alt"]);return i.a.createElement("img",Object.assign({"aria-hidden":o,sizes:a,srcSet:r,src:n,alt:d},m,{ref:t,loading:l,draggable:c,style:Object.assign({position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"},s)}))})),g=function(e){function t(){return e.apply(this,arguments)||this}return Object(s.a)(t,e),t.prototype.render=function(){var e,t,a,r,n,s=(e=this.props,t=Object.assign({},e),a=t.resolutions,r=t.sizes,n=t.critical,a&&(t.fixed=a,delete t.resolutions),r&&(t.fluid=r,delete t.sizes),n&&(t.loading="eager"),t.fluid&&(t.fluid=l([].concat(t.fluid))),t.fixed&&(t.fixed=l([].concat(t.fixed))),t),g=s.title,p=s.alt,f=s.className,h=s.style,y=void 0===h?{}:h,b=s.imgStyle,E=void 0===b?{}:b,S=s.placeholderStyle,v=void 0===S?{}:S,w=s.placeholderClassName,O=s.fluid,z=s.fixed,j=s.Tag,k=s.itemProp,x=s.loading,H=s.draggable,P=Object.assign({},E),V={title:g,alt:"",style:Object.assign({},E,v),className:w,itemProp:k};if(O){var N=O,R=O[0];return i.a.createElement(j,{className:(f||"")+" gatsby-image-wrapper",style:Object.assign({position:"relative",overflow:"hidden"},y),key:"fluid-"+JSON.stringify(R.srcSet)},i.a.createElement(j,{"aria-hidden":!0,style:{width:"100%",paddingBottom:100/R.aspectRatio+"%"}}),R.base64&&i.a.createElement(m,{ariaHidden:!0,src:R.base64,spreadProps:V,imageVariants:N,generateSources:d}),R.tracedSVG&&i.a.createElement(m,{ariaHidden:!0,src:R.tracedSVG,spreadProps:V,imageVariants:N,generateSources:o}),i.a.createElement("picture",null,c(N),i.a.createElement(u,{alt:p,title:g,sizes:R.sizes,src:R.src,crossOrigin:this.props.crossOrigin,srcSet:R.srcSet,style:P,ref:this.imageRef,itemProp:k,loading:x,draggable:H})))}if(z){var G=z,B=z[0],I=Object.assign({position:"relative",overflow:"hidden",display:"inline-block",width:B.width,height:B.height},y);return"inherit"===y.display&&delete I.display,i.a.createElement(j,{className:(f||"")+" gatsby-image-wrapper",style:I,key:"fixed-"+JSON.stringify(B.srcSet)},B.base64&&i.a.createElement(m,{ariaHidden:!0,src:B.base64,spreadProps:V,imageVariants:G,generateSources:d}),B.tracedSVG&&i.a.createElement(m,{ariaHidden:!0,src:B.tracedSVG,spreadProps:V,imageVariants:G,generateSources:o}),i.a.createElement("picture",null,c(G),i.a.createElement(u,{alt:p,title:g,width:B.width,height:B.height,sizes:B.sizes,src:B.src,crossOrigin:this.props.crossOrigin,srcSet:B.srcSet,style:P,itemProp:k,loading:x,draggable:H})))}return null},t}(i.a.Component);g.defaultProps={fadeIn:!0,alt:"",Tag:"div",loading:"lazy"};var p=g,f=a("p3AD");t.a=function(){var e=Object(n.useStaticQuery)("4138022990"),t=e.site.siteMetadata,a=t.author,r=t.social;return i.a.createElement("div",{style:{display:"flex",marginBottom:Object(f.a)(2.5)}},i.a.createElement(p,{fixed:e.avatar.childImageSharp.fixed,alt:a.name,style:{marginRight:Object(f.a)(.5),marginBottom:0,minWidth:50,borderRadius:"100%"},imgStyle:{borderRadius:"50%"}}),i.a.createElement("p",null,"Written by ",i.a.createElement("strong",null,a.name)," ",a.summary," ",i.a.createElement("a",{href:"https://twitter.com/"+r.twitter},"He spends way too much time on Twitter")))}},RXBc:function(e,t,a){"use strict";a.r(t),a.d(t,"pageQuery",(function(){return d}));var r=a("q1tI"),i=a.n(r),n=a("Wbzz"),s=a("6Gk8"),l=a("Bl7J"),c=a("vrFN"),o=a("p3AD");t.default=function(e){var t=e.data,a=e.location,r=t.site.siteMetadata.title,d=t.allMarkdownRemark.edges;return i.a.createElement(l.a,{location:a,title:r},i.a.createElement(c.a,{title:"All posts"}),i.a.createElement(s.a,null),d.map((function(e){var t=e.node,a=t.frontmatter.title||t.fields.slug;return i.a.createElement("article",{key:t.fields.slug},i.a.createElement("header",null,i.a.createElement("h3",{style:{marginBottom:Object(o.a)(1/4)}},i.a.createElement(n.Link,{style:{boxShadow:"none"},to:t.fields.slug},a)),i.a.createElement("small",null,t.frontmatter.date)),i.a.createElement("section",null,i.a.createElement("p",{dangerouslySetInnerHTML:{__html:t.frontmatter.description||t.excerpt}})))})))};var d="173509685"}}]);
//# sourceMappingURL=component---src-pages-index-js-6570e48fdb5d147e3d49.js.map