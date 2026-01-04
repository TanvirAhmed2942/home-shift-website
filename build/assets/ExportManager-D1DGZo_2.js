import{c as C,r as m,j as e,B as j,a6 as M,a7 as B,a8 as P,a9 as q,aa as V,t as g}from"./index-5UJQZh1O.js";import{F as N,c as I,e as U}from"./badge-CFUPwwPp.js";import{L as D,S as _,a as z,b as A,c as H,d as o}from"./select-Ddo_QBJM.js";import{D as f}from"./download-Iv45di7Q.js";import{C as J}from"./check-BrggnjjL.js";import{F as Y}from"./funnel-O1tagNyY.js";import"./chevron-up-DtIYN2S8.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]],G=C("file-spreadsheet",Z);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}]],Q=C("file",K);function le({data:y=[],filename:c,title:v="Export Data"}){const[E,d]=m.useState(!1),[i,S]=m.useState("csv"),[u,$]=m.useState("all"),[k,b]=m.useState(!1),F=(t,s)=>{if(!t||t.length===0)return;const r=Object.keys(t[0]),a=[r.join(","),...t.map(n=>r.map(h=>{const x=n[h];return typeof x=="string"&&x.includes(",")?`"${x}"`:x}).join(","))].join(`
`),l=new Blob([a],{type:"text/csv;charset=utf-8;"});p(l,`${s}.csv`)},O=(t,s)=>{const r=JSON.stringify(t,null,2),a=new Blob([r],{type:"application/json"});p(a,`${s}.json`)},L=async(t,s)=>{const r=`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${s}</title>
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
          <h1>${v}</h1>
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
    `,a=new Blob([r],{type:"text/html"});p(a,`${s}.html`)},R=(t,s)=>{if(!t||t.length===0)return;const r=Object.keys(t[0]),a=[r.join("	"),...t.map(n=>r.map(h=>n[h]).join("	"))].join(`
`),l=new Blob([a],{type:"application/vnd.ms-excel"});p(l,`${s}.xls`)},p=(t,s)=>{const r=window.URL.createObjectURL(t),a=document.createElement("a");a.href=r,a.download=s,document.body.appendChild(a),a.click(),document.body.removeChild(a),window.URL.revokeObjectURL(r)},w=t=>{if(!t)return[];if(u==="all")return t;const s=new Date,a={today:1,week:7,month:30,quarter:90,year:365}[u];if(!a)return t;const l=new Date(s.getTime()-a*24*60*60*1e3);return t.filter(n=>new Date(n.createdAt||n.date||n.timestamp)>=l)},T=async()=>{b(!0);const t=w(y);if(t.length===0){g.error("No data to export",{description:"Please select a different date range or check your data."}),b(!1);return}try{switch(i){case"csv":F(t,c);break;case"json":O(t,c);break;case"pdf":await L(t,c);break;case"excel":R(t,c);break}g.success("Export successful!",{description:`Downloaded ${t.length} records as ${i.toUpperCase()}`}),d(!1)}catch{g.error("Export failed",{description:"Please try again or contact support."})}b(!1)};return e.jsxs(e.Fragment,{children:[e.jsxs(j,{onClick:()=>d(!0),variant:"outline",className:"gap-2",children:[e.jsx(f,{className:"w-4 h-4"}),"Export"]}),e.jsx(M,{open:E,onOpenChange:d,children:e.jsxs(B,{className:"max-w-md",children:[e.jsxs(P,{children:[e.jsxs(q,{className:"flex items-center gap-2",children:[e.jsx(f,{className:"w-5 h-5 text-purple-600"}),v]}),e.jsx(V,{children:"Choose your export format and date range"})]}),e.jsxs("div",{className:"space-y-6 py-4",children:[e.jsxs("div",{children:[e.jsx(D,{className:"mb-3 block",children:"Export Format"}),e.jsx("div",{className:"grid grid-cols-2 gap-3",children:[{value:"csv",label:"CSV",icon:N,desc:"Comma-separated values"},{value:"excel",label:"Excel",icon:G,desc:"Microsoft Excel"},{value:"pdf",label:"PDF",icon:Q,desc:"Printable document"},{value:"json",label:"JSON",icon:N,desc:"Raw data format"}].map(t=>{const s=t.icon;return e.jsxs("button",{onClick:()=>S(t.value),className:`p-4 border-2 rounded-lg text-left transition-all ${i===t.value?"border-purple-600 bg-purple-50 dark:bg-purple-900/20":"border-gray-200 dark:border-gray-700 hover:border-purple-300"}`,children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx(s,{className:"w-5 h-5 text-purple-600"}),i===t.value&&e.jsx(J,{className:"w-4 h-4 text-purple-600"})]}),e.jsx("div",{className:"font-semibold mb-1",children:t.label}),e.jsx("div",{className:"text-xs text-gray-500 dark:text-gray-400",children:t.desc})]},t.value)})})]}),e.jsxs("div",{children:[e.jsxs(D,{htmlFor:"dateRange",className:"flex items-center gap-2 mb-2",children:[e.jsx(I,{className:"w-4 h-4"}),"Date Range"]}),e.jsxs(_,{value:u,onValueChange:$,children:[e.jsx(z,{id:"dateRange",children:e.jsx(A,{})}),e.jsxs(H,{children:[e.jsx(o,{value:"all",children:"All Time"}),e.jsx(o,{value:"today",children:"Today"}),e.jsx(o,{value:"week",children:"Last 7 Days"}),e.jsx(o,{value:"month",children:"Last 30 Days"}),e.jsx(o,{value:"quarter",children:"Last 90 Days"}),e.jsx(o,{value:"year",children:"Last Year"})]})]})]}),e.jsx(U,{className:"p-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(Y,{className:"w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold text-sm mb-1",children:"Export Preview"}),e.jsxs("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:[w(y).length," records will be exported"]})]})]})})]}),e.jsxs("div",{className:"flex gap-3",children:[e.jsx(j,{onClick:T,disabled:k,className:"flex-1 bg-gradient-to-r from-purple-600 to-pink-600",children:k?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"}),"Exporting..."]}):e.jsxs(e.Fragment,{children:[e.jsx(f,{className:"w-4 h-4 mr-2"}),"Export Now"]})}),e.jsx(j,{onClick:()=>d(!1),variant:"outline",className:"flex-1",children:"Cancel"})]})]})})]})}export{le as ExportManager};
