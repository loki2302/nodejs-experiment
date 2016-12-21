require('./domstubs.js');
const pdfjs = require('pdfjs-dist');
const fs = require('fs');

(async function() {
	const pdfBytes = new Uint8Array(fs.readFileSync('dummy.pdf'));
	const doc = await pdfjs.getDocument(pdfBytes);
	
	const numberOfPages = doc.numPages;
	for(var i = 1; i <= numberOfPages; ++i) {
		const page = await doc.getPage(i);
		
		const viewport = page.getViewport(1.0);
		console.log(viewport);

		const operatorList = await page.getOperatorList();

		const svgGfx = new pdfjs.SVGGraphics(page.commonObjs, page.objs);
		//svgGfx.embedFonts = true;

		const svg = await svgGfx.getSVG(operatorList, viewport);
		fs.writeFileSync('1.svg', svg.toString());
		console.log(svg.toString());

		const content = await page.getTextContent();
		console.log(JSON.stringify(content, null, 2));
	}
})();
