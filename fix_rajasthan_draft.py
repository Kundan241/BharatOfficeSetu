with open('/Users/kundanmishra/Desktop/BackendProject/src/pages/DraftGenerator.jsx', 'r') as f:
    content = f.read()

# 1. Update addOrangeHeader
old_orange = "const headerText = template.id === 'dwarka-template' ? 'WORKSPACE SERVICE AGREEMENT' : template.name.toUpperCase();"
new_orange = "const headerText = template.id === 'dwarka-template' ? 'WORKSPACE SERVICE AGREEMENT' : template.id === 'rajasthan-template' ? '' : template.name.toUpperCase();"
content = content.replace(old_orange, new_orange)

# 2. Update generic title block condition
old_cond = "if (template.id !== 'dwarka-template') {"
new_cond = "if (template.id !== 'dwarka-template' && template.id !== 'rajasthan-template') {"
content = content.replace(old_cond, new_cond)

# 3. Update buildRajasthanTemplate title
old_build_title = """    doc.text('WORK SPACE SERVICE CONTRACT', h.pageWidth / 2, h.yPos(), { align: 'center' });
    const textWidth = doc.getTextWidth('WORK SPACE SERVICE CONTRACT');
    doc.setLineWidth(0.5);
    doc.line((h.pageWidth - textWidth) / 2, h.yPos() + 1, (h.pageWidth + textWidth) / 2, h.yPos() + 1);"""
new_build_title = """    doc.text('WORKSPACE SERVICE AGREEMENT', h.pageWidth / 2, h.yPos(), { align: 'center' });"""
content = content.replace(old_build_title, new_build_title)

# 4. Update preview title
old_preview_title = "<p style={{ textAlign: 'center', fontWeight: 'bold' }}>WORK SPACE SERVICE CONTRACT</p>"
new_preview_title = "<p style={{ textAlign: 'center', fontWeight: 'bold' }}>WORKSPACE SERVICE AGREEMENT</p>"
content = content.replace(old_preview_title, new_preview_title)

with open('/Users/kundanmishra/Desktop/BackendProject/src/pages/DraftGenerator.jsx', 'w') as f:
    f.write(content)

