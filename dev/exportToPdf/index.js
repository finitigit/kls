import jsPDF from 'jspdf'
import logo from './logo'
import font from './font'


const txt = (doc, str, h) => {
    /*  const splitString = str.split('');
     const reverseArray = splitString.reverse();
     reverseArray.join(''); */
    doc.text(str/* reverseArray.join('') */, 200, h, { align: 'right' })
}

export default function (session, loggedIn) {

    const doc = new jsPDF()

    doc.addFileToVFS("cFont.ttf", font)
    doc.addFont('cFont.ttf', 'cFont', 'normal')
    doc.setFont('cFont')

    doc.addImage(logo, 'png', 65, 5)

    doc.setFontSize(8)
    doc.text(new Date().toLocaleString(), 10, 10)

    txt(doc, `ייצוא ע"י: ${loggedIn.name}`, 10)

    doc.setFontSize(20)
    txt(doc, 'תוצאות', 50)

    doc.setTextColor('gray')
    doc.setFontSize(10)
    txt(doc, `עבור: ${(session.client || {}).client_fname || ''}  ${(session.client || {}).client_lname || ''}`, 60)
    txt(doc, `ת.ז: ${(session.client || {}).client_id || ''}`, 66)

    let line = 80
    session.tests.forEach(t => {
        txt(doc, `${t.name} תוצאות בדיקת`, line)
        doc.setTextColor(t.pass ? 'green' : 'red')
        line += 6
        txt(doc, `${t.pass ? `עבר` : 'לא עבר'}  (${Array.isArray(t.res) ? t.res.join(', ') : t.res})`, line)
        doc.setTextColor('gray')
        line += 9
    })

    doc.save(`בדיקה ${session.name}`)
}