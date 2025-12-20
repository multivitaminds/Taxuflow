(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,121755,e=>{"use strict";var s=e.i(878957),t=e.i(970065),a=e.i(167881),l=e.i(913278),r=e.i(492313),i=e.i(470661),c=e.i(776291),n=e.i(702542);e.s(["default",0,function(){return(0,s.jsx)("div",{className:"min-h-screen bg-[#0A0A0A]",children:(0,s.jsxs)("div",{className:"max-w-5xl mx-auto px-6 py-12",children:[(0,s.jsxs)("div",{className:"mb-12",children:[(0,s.jsxs)("div",{className:"flex items-center gap-3 mb-4",children:[(0,s.jsx)("div",{className:"w-12 h-12 rounded-lg bg-[#007396]/10 flex items-center justify-center",children:(0,s.jsx)(l.Code,{className:"w-6 h-6 text-[#007396]"})}),(0,s.jsxs)("div",{children:[(0,s.jsx)("h1",{className:"text-4xl font-bold text-white",children:"Java SDK"}),(0,s.jsx)("p",{className:"text-gray-400 mt-1",children:"Official Taxu Java library"})]})]}),(0,s.jsxs)("div",{className:"flex gap-3",children:[(0,s.jsxs)(a.Button,{className:"bg-[#635BFF] hover:bg-[#0A2540] text-white",children:[(0,s.jsx)(r.Download,{className:"w-4 h-4 mr-2"}),"Install via Maven"]}),(0,s.jsxs)(a.Button,{variant:"outline",className:"border-gray-800 text-gray-300 hover:bg-gray-900 bg-transparent",children:[(0,s.jsx)(i.BookOpen,{className:"w-4 h-4 mr-2"}),"View on GitHub"]})]})]}),(0,s.jsxs)("section",{className:"mb-12",children:[(0,s.jsx)("h2",{className:"text-2xl font-bold text-white mb-6",children:"Installation"}),(0,s.jsx)(t.Card,{className:"bg-[#111111] border-gray-800 p-6",children:(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"text-sm text-gray-400 mb-2",children:"Maven"}),(0,s.jsx)("pre",{className:"bg-black p-4 rounded-lg overflow-x-auto",children:(0,s.jsx)("code",{className:"text-sm text-gray-300",children:`<dependency>
    <groupId>io.taxu</groupId>
    <artifactId>taxu-java</artifactId>
    <version>1.0.0</version>
</dependency>`})})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"text-sm text-gray-400 mb-2",children:"Gradle"}),(0,s.jsx)("pre",{className:"bg-black p-4 rounded-lg overflow-x-auto",children:(0,s.jsx)("code",{className:"text-sm text-gray-300",children:"implementation 'io.taxu:taxu-java:1.0.0'"})})]})]})})]}),(0,s.jsxs)("section",{className:"mb-12",children:[(0,s.jsx)("h2",{className:"text-2xl font-bold text-white mb-6",children:"Quick Start"}),(0,s.jsx)(t.Card,{className:"bg-[#111111] border-gray-800 p-6",children:(0,s.jsx)("pre",{className:"bg-black p-4 rounded-lg overflow-x-auto",children:(0,s.jsx)("code",{className:"text-sm text-gray-300",children:`import io.taxu.TaxuClient;
import io.taxu.models.*;

public class TaxuExample {
    public static void main(String[] args) {
        // Initialize client
        TaxuClient client = new TaxuClient("your_api_key_here");
        
        // Upload document
        client.documents().upload(
            new File("w2.pdf"),
            DocumentType.W2
        );
        
        // Calculate refund
        client.tax().calculateRefund(
            new RefundRequest()
                .income(75000)
                .filingStatus(FilingStatus.SINGLE)
                .state("CA")
        );
    }
}`})})})]}),(0,s.jsxs)("section",{className:"mb-12",children:[(0,s.jsx)("h2",{className:"text-2xl font-bold text-white mb-6",children:"Features"}),(0,s.jsx)("div",{className:"grid md:grid-cols-2 gap-4",children:[{icon:c.Zap,title:"Type Safe",desc:"Full type safety with generics"},{icon:l.Code,title:"Builder Pattern",desc:"Fluent API design"},{icon:i.BookOpen,title:"Spring Boot",desc:"First-class Spring integration"},{icon:r.Download,title:"Maven Central",desc:"Available on Maven Central"}].map((e,a)=>(0,s.jsxs)(t.Card,{className:"bg-[#111111] border-gray-800 p-6",children:[(0,s.jsx)(e.icon,{className:"w-8 h-8 text-[#635BFF] mb-3"}),(0,s.jsx)("h3",{className:"text-lg font-semibold text-white mb-2",children:e.title}),(0,s.jsx)("p",{className:"text-gray-400 text-sm",children:e.desc})]},a))})]}),(0,s.jsxs)("section",{className:"mb-12",children:[(0,s.jsx)("h2",{className:"text-2xl font-bold text-white mb-6",children:"API Reference"}),(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsxs)(t.Card,{className:"bg-[#111111] border-gray-800 p-6",children:[(0,s.jsx)("h3",{className:"text-xl font-semibold text-white mb-4",children:"Document Upload"}),(0,s.jsx)("pre",{className:"bg-black p-4 rounded-lg overflow-x-auto mb-4",children:(0,s.jsx)("code",{className:"text-sm text-gray-300",children:`client.documents().upload(
    new File("document.pdf"),
    DocumentType.W2
);`})})]}),(0,s.jsxs)(t.Card,{className:"bg-[#111111] border-gray-800 p-6",children:[(0,s.jsx)("h3",{className:"text-xl font-semibold text-white mb-4",children:"Tax Calculation"}),(0,s.jsx)("pre",{className:"bg-black p-4 rounded-lg overflow-x-auto mb-4",children:(0,s.jsx)("code",{className:"text-sm text-gray-300",children:`RefundResponse response = client.tax().calculateRefund(
    new RefundRequest()
        .income(75000)
        .filingStatus(FilingStatus.SINGLE)
);`})})]})]})]}),(0,s.jsxs)("section",{children:[(0,s.jsx)("h2",{className:"text-2xl font-bold text-white mb-6",children:"Next Steps"}),(0,s.jsxs)("div",{className:"grid md:grid-cols-3 gap-4",children:[(0,s.jsx)(n.default,{href:"/developer/docs/api/documents",children:(0,s.jsxs)(t.Card,{className:"bg-[#111111] border-gray-800 p-6 hover:border-[#635BFF] transition-colors cursor-pointer",children:[(0,s.jsx)("h3",{className:"text-lg font-semibold text-white mb-2",children:"API Reference"}),(0,s.jsx)("p",{className:"text-gray-400 text-sm",children:"Explore all available endpoints"})]})}),(0,s.jsx)(n.default,{href:"/developer/examples",children:(0,s.jsxs)(t.Card,{className:"bg-[#111111] border-gray-800 p-6 hover:border-[#635BFF] transition-colors cursor-pointer",children:[(0,s.jsx)("h3",{className:"text-lg font-semibold text-white mb-2",children:"Code Examples"}),(0,s.jsx)("p",{className:"text-gray-400 text-sm",children:"See real-world implementations"})]})}),(0,s.jsx)(n.default,{href:"/developer/support",children:(0,s.jsxs)(t.Card,{className:"bg-[#111111] border-gray-800 p-6 hover:border-[#635BFF] transition-colors cursor-pointer",children:[(0,s.jsx)("h3",{className:"text-lg font-semibold text-white mb-2",children:"Get Help"}),(0,s.jsx)("p",{className:"text-gray-400 text-sm",children:"Contact our support team"})]})})]})]})]})})}])}]);