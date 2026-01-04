import{j as e}from"./radix-vendor-BV-zUPZ_.js";import{a as h}from"./react-vendor-BK8AH302.js";import{B as j,D as T,q as B,v as P,w as I,x as U,t as g}from"./index-CcmsAmAk.js";import{C as q}from"./badge-ouIqNJOe.js";import{L as k,S as V,a as A,b as J,c as M,d as o}from"./select-YY8woB_z.js";import{bI as f,aR as D,cp as Y,cq as G,as as H,aP as z,bB as K}from"./ui-vendor-DgaPPGCl.js";function te({data:v=[],filename:c,title:y="Export Data"}){const[C,i]=h.useState(!1),[d,E]=h.useState("csv"),[u,S]=h.useState("all"),[w,b]=h.useState(!1),$=(t,a)=>{if(!t||t.length===0)return;const r=Object.keys(t[0]),s=[r.join(","),...t.map(n=>r.map(x=>{const m=n[x];return typeof m=="string"&&m.includes(",")?`"${m}"`:m}).join(","))].join(`
`),l=new Blob([s],{type:"text/csv;charset=utf-8;"});p(l,`${a}.csv`)},F=(t,a)=>{const r=JSON.stringify(t,null,2),s=new Blob([r],{type:"application/json"});p(s,`${a}.json`)},O=async(t,a)=>{const r=`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${a}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #6b21a8; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #6b21a8; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>${y}</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                ${Object.keys(t[0]||{}).map(l=>`<th>${l}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${t.map(l=>`
                <tr>
                  ${Object.values(l).map(n=>`<td>${n}</td>`).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `,s=new Blob([r],{type:"text/html"});p(s,`${a}.html`)},R=(t,a)=>{if(!t||t.length===0)return;const r=Object.keys(t[0]),s=[r.join("	"),...t.map(n=>r.map(x=>n[x]).join("	"))].join(`
`),l=new Blob([s],{type:"application/vnd.ms-excel"});p(l,`${a}.xls`)},p=(t,a)=>{const r=window.URL.createObjectURL(t),s=document.createElement("a");s.href=r,s.download=a,document.body.appendChild(s),s.click(),document.body.removeChild(s),window.URL.revokeObjectURL(r)},N=t=>{if(!t)return[];if(u==="all")return t;const a=new Date,s={today:1,week:7,month:30,quarter:90,year:365}[u];if(!s)return t;const l=new Date(a.getTime()-s*24*60*60*1e3);return t.filter(n=>new Date(n.createdAt||n.date||n.timestamp)>=l)},L=async()=>{b(!0);const t=N(v);if(t.length===0){g.error("No data to export",{description:"Please select a different date range or check your data."}),b(!1);return}try{switch(d){case"csv":$(t,c);break;case"json":F(t,c);break;case"pdf":await O(t,c);break;case"excel":R(t,c);break}g.success("Export successful!",{description:`Downloaded ${t.length} records as ${d.toUpperCase()}`}),i(!1)}catch{g.error("Export failed",{description:"Please try again or contact support."})}b(!1)};return e.jsxs(e.Fragment,{children:[e.jsxs(j,{onClick:()=>i(!0),variant:"outline",className:"gap-2",children:[e.jsx(f,{className:"w-4 h-4"}),"Export"]}),e.jsx(T,{open:C,onOpenChange:i,children:e.jsxs(B,{className:"max-w-md",children:[e.jsxs(P,{children:[e.jsxs(I,{className:"flex items-center gap-2",children:[e.jsx(f,{className:"w-5 h-5 text-purple-600"}),y]}),e.jsx(U,{children:"Choose your export format and date range"})]}),e.jsxs("div",{className:"space-y-6 py-4",children:[e.jsxs("div",{children:[e.jsx(k,{className:"mb-3 block",children:"Export Format"}),e.jsx("div",{className:"grid grid-cols-2 gap-3",children:[{value:"csv",label:"CSV",icon:D,desc:"Comma-separated values"},{value:"excel",label:"Excel",icon:Y,desc:"Microsoft Excel"},{value:"pdf",label:"PDF",icon:G,desc:"Printable document"},{value:"json",label:"JSON",icon:D,desc:"Raw data format"}].map(t=>{const a=t.icon;return e.jsxs("button",{onClick:()=>E(t.value),className:`p-4 border-2 rounded-lg text-left transition-all ${d===t.value?"border-purple-600 bg-purple-50 dark:bg-purple-900/20":"border-gray-200 dark:border-gray-700 hover:border-purple-300"}`,children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx(a,{className:"w-5 h-5 text-purple-600"}),d===t.value&&e.jsx(H,{className:"w-4 h-4 text-purple-600"})]}),e.jsx("div",{className:"font-semibold mb-1",children:t.label}),e.jsx("div",{className:"text-xs text-gray-500 dark:text-gray-400",children:t.desc})]},t.value)})})]}),e.jsxs("div",{children:[e.jsxs(k,{htmlFor:"dateRange",className:"flex items-center gap-2 mb-2",children:[e.jsx(z,{className:"w-4 h-4"}),"Date Range"]}),e.jsxs(V,{value:u,onValueChange:S,children:[e.jsx(A,{id:"dateRange",children:e.jsx(J,{})}),e.jsxs(M,{children:[e.jsx(o,{value:"all",children:"All Time"}),e.jsx(o,{value:"today",children:"Today"}),e.jsx(o,{value:"week",children:"Last 7 Days"}),e.jsx(o,{value:"month",children:"Last 30 Days"}),e.jsx(o,{value:"quarter",children:"Last 90 Days"}),e.jsx(o,{value:"year",children:"Last Year"})]})]})]}),e.jsx(q,{className:"p-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(K,{className:"w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold text-sm mb-1",children:"Export Preview"}),e.jsxs("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:[N(v).length," records will be exported"]})]})]})})]}),e.jsxs("div",{className:"flex gap-3",children:[e.jsx(j,{onClick:L,disabled:w,className:"flex-1 bg-gradient-to-r from-purple-600 to-pink-600",children:w?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"}),"Exporting..."]}):e.jsxs(e.Fragment,{children:[e.jsx(f,{className:"w-4 h-4 mr-2"}),"Export Now"]})}),e.jsx(j,{onClick:()=>i(!1),variant:"outline",className:"flex-1",children:"Cancel"})]})]})})]})}export{te as ExportManager};
