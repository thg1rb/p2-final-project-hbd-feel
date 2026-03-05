// export async function downloadAsPDF(element: HTMLElement, filename = 'document.pdf') {
//   const html2canvasModule = await import('html2canvas');
//   const jsPDFModule = await import('jspdf');

//   const html2canvas = html2canvasModule.default;
//   const JsPDF = jsPDFModule.jsPDF;

//   const canvas = await html2canvas(element, {
//     scale: 3,          // ← render ความละเอียดสูง
//     useCORS: true,
//     width: 794,
//     windowWidth: 794,
//   });

//   const imgData = canvas.toDataURL('image/png', 1.0); // ← quality เต็ม

//   const pdf = new JsPDF('p', 'mm', 'a4');

//   const pageWidth = pdf.internal.pageSize.getWidth();
//   const pageHeight = pdf.internal.pageSize.getHeight();
//   const imgHeight = (canvas.height * pageWidth) / canvas.width;

//   let heightLeft = imgHeight;
//   let position = 0;

//   pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight, '', 'FAST');
//   heightLeft -= pageHeight;

//   while (heightLeft > 0) {
//     position = heightLeft - imgHeight;
//     pdf.addPage();
//     pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight, '', 'FAST');
//     heightLeft -= pageHeight;
//   }

//   pdf.save(filename);
// }

import type { Application } from '$lib/type';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function fixThaiFont(text: string): string {
  if (!text) return '';

  // ใช้ Unicode normalization ก่อน
  let result = text.normalize('NFC');

  // สระบน + วรรณยุกต์ → สลับลำดับ
  result = result.replace(/([\u0E34-\u0E37\u0E31])([\u0E48-\u0E4B\u0E47])/g, '$2$1');

  // สระล่าง + วรรณยุกต์ → สลับลำดับ  
  result = result.replace(/([\u0E38\u0E39])([\u0E48-\u0E4B])/g, '$2$1');

  // นิคหิต ํ + วรรณยุกต์
  result = result.replace(/(\u0E4D)([\u0E48-\u0E4B])/g, '$2$1');

  return result;
}

async function loadFont(pdf: jsPDF) {
  const response = await fetch('/fonts/THSarabunNew.ttf');
  const blob = await response.blob();

  return new Promise<void>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = (reader.result as string).split(',')[1];
      pdf.addFileToVFS('THSarabunNew.ttf', base64data);
      pdf.addFont('THSarabunNew.ttf', 'Sarabun', 'normal');
      pdf.setFont('Sarabun');
      resolve();
    };
    reader.readAsDataURL(blob);
  });
}

function loadImageBase64(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // คืนค่า Base64 โดยตัด "data:..." ข้างหน้าออก
          const base64data = (reader.result as string).split(',')[1];
          resolve(base64data);
        };
        reader.readAsDataURL(blob);
      })
      .catch(err => {
        console.error('ไม่สามารถโหลดตราสัญลักษณ์ได้:', err);
        resolve(null); // กรณีโหลดไม่ได้ ให้ไปต่อโดยไม่มีรูป
      });
  });
}

function toThaiNumber(text: string | number): string {
  const thaiNums = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
  return text.toString().replace(/[0-9]/g, (d) => thaiNums[parseInt(d)]);
}

export async function downloadTableAsPDF(
  applications: Application[],
  headers: string[],
  filename = 'document.pdf',
  userName: string,
) {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    await loadFont(pdf);

    const pageWidth = pdf.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;
    pdf.setFont('Sarabun', 'normal');

    // ===== หน้าที่ 1: ประกาศมหาวิทยาลัย =====
    const logoBase64 = await loadImageBase64('/image/ku-symbol.png');
    if (logoBase64) {
      pdf.addImage(logoBase64, 'PNG', centerX - 30, 8, 60, 60, '', 'FAST');
    }

    pdf.setFontSize(18);
    pdf.text(fixThaiFont('ประกาศมหาวิทยาลัยเกษตรศาสตร์'), centerX, 75, { align: 'center' });

    pdf.setFontSize(14);
    const firstApp = applications[0];
    const semText = firstApp?.event?.semester === 1 ? 'ต้น' : 'ปลาย';
    // แปลงปี พ.ศ. เป็นเลขไทย
    const yearText = toThaiNumber(firstApp?.event?.academic_year || '....');

    const subTitle1 = 'เรื่อง นิสิตที่มีความประพฤติดีเด่น นิสิตที่มีผลงานดีเด่นด้านกิจกรรมเสริมหลักสูตร';
    const subTitle2 = `และนิสิตที่มีผลงานดีเด่นด้านความคิดสร้างสรรค์และนวัตกรรม ประจำภาค${semText} ปีการศึกษา ${yearText}`;

    pdf.text(fixThaiFont(subTitle1), centerX, 83, { align: 'center' });
    pdf.text(fixThaiFont(subTitle2), centerX, 91, { align: 'center' });

    // 2. เส้นคั่นกึ่งกลาง (แบบเส้นประ)
    pdf.setGState(new (pdf as any).GState({ opacity: 0.6 })); // (Option) ปรับความเข้มจางลงเล็กน้อยเพื่อให้ดูบางตา
    pdf.setLineWidth(0.15); // ปรับความหนาเส้นให้บางลงมาก

    // [1, 1] คือ ขีด 1 มม. เว้น 1 มม. จะได้ลักษณะเส้นไข่ปลาที่ละเอียด
    pdf.setLineDashPattern([1, 1], 0);

    pdf.line(centerX - 20, 97, centerX + 20, 97);

    // สำคัญ: Reset ทุกอย่างกลับค่าเดิม
    pdf.setLineDashPattern([], 0);
    pdf.setLineWidth(0.2); // ค่าเริ่มต้นปกติ
    pdf.setGState(new (pdf as any).GState({ opacity: 1 })); // คืนค่าความเข้ม

    const content = [
      `ตามที่มหาวิทยาลัยเกษตรศาสตร์ ได้ตราระเบียบว่าด้วยการเสริมสร้างค่านิยมที่ดีของนิสิต พ.ศ. ${toThaiNumber(2553)} `,
      `เพื่อเสริมสร้างให้นิสิตได้มีค่านิยมต่อการประกอบความดีให้ยิ่ง ๆ ขึ้นไป นั้น สำหรับประจำภาค${semText} ปีการศึกษา ${yearText} นี้ `,
      'คณะอนุกรรมการพิจารณานิสิตดีเด่นและผู้แทนนิสิตเข้ารับรางวัลพระราชทาน ได้ดำเนินการคัดเลือกนิสิตที่มี',
      'คุณสมบัติตตามที่ได้กำหนดไว้ในระเบียบดังกล่าว ตามรายชื่อแนบท้ายประกาศดังนี้'
    ];

    let currentY = 108;
    content.forEach(line => {
      pdf.text(fixThaiFont(line), 25, currentY, { maxWidth: pageWidth - 50, align: 'justify' });
      currentY += 8;
    });

    currentY += 10;
    const stats = [
      { label: 'นิสิตที่มีความประพฤติดีเด่น', count: applications.filter(a => a.award.name.includes('ประพฤติ')).length },
      { label: 'นิสิตที่มีผลงานดีเด่นด้านกิจกรรมเสริมหลักสูตร', count: applications.filter(a => a.award.name.includes('กิจกรรม')).length },
      { label: 'นิสิตที่มีผลงานดีเด่นด้านความคิดสร้างสรรค์และนวัตกรรม', count: applications.filter(a => a.award.name.includes('นวัตกรรม')).length }
    ];

    stats.forEach(item => {
      pdf.text(fixThaiFont(item.label), 40, currentY);
      // แปลงจำนวนคนเป็นเลขไทย
      pdf.text(fixThaiFont(`จำนวน  ${toThaiNumber(item.count)}  คน`), 155, currentY);
      currentY += 10;
    });

    pdf.text(fixThaiFont('จึงประกาศมาเพื่อเป็นเกียรติสืบไป'), 40, currentY + 5);

    // ส่วนลงชื่อ
    const today = new Date();
    const thaiMonth = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"][today.getMonth()];
    // แปลงวันที่และปี พ.ศ. ปัจจุบันเป็นเลขไทย
    const thaiDate = `ประกาศ ณ วันที่ ${toThaiNumber(today.getDate())} ${thaiMonth} พ.ศ. ${toThaiNumber(today.getFullYear() + 543)}`;

    const signAreaX = pageWidth - 60;
    let signY = currentY + 30;

    pdf.text(fixThaiFont(thaiDate), signAreaX, signY, { align: 'center' });
    signY += 25;
    pdf.text(fixThaiFont(`(${userName})`), signAreaX, signY, { align: 'center' });
    signY += 8;
    pdf.text(fixThaiFont('อธิการบดีมหาวิทยาลัยเกษตรศาสตร์'), signAreaX, signY, { align: 'center' });


    // ===== หน้าที่ 2 เป็นต้นไป: แยกตารางรายชื่อ =====
    const groupedApps = applications.reduce((acc, app) => {
      const awardName = app.award.name;
      if (!acc[awardName]) acc[awardName] = [];
      acc[awardName].push(app);
      return acc;
    }, {} as Record<string, any[]>);

    Object.keys(groupedApps).forEach((awardName) => {
      pdf.addPage();
      const appsInGroup = groupedApps[awardName];
      const semester = appsInGroup[0]?.event?.semester === 1 ? 'ต้น' : 'ปลาย';
      const year = toThaiNumber(appsInGroup[0]?.event?.academic_year);

      const headerLine1 = `รายชื่อนิสิตที่มีผลงานดีเด่นด้าน${awardName} ภาค${semester} ประจำปีการศึกษา ${year}`;

      const tableRows = appsInGroup.map((app, index) => [
        index + 1, // ลำดับที่ (ถ้ามีใน headers)
        app.user.student_id, // รหัสนิสิตเลขไทย
        fixThaiFont(`${app.user.firstName} ${app.user.lastName}`),
        fixThaiFont(app.user.faculty.name),
        fixThaiFont(app.user.department.name),
        app.year,
        fixThaiFont(app.award.name)
      ]);

      autoTable(pdf, {
        head: [headers.map(h => fixThaiFont(h))],
        body: tableRows,
        startY: 25,
        margin: { top: 25 },
        theme: 'grid',
        styles: {
          font: 'Sarabun',
          fontSize: 13,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0]
        },
        headStyles: {
          fontStyle: 'normal',
          font: 'Sarabun',
          halign: 'center',
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineWidth: 0.1,
          lineColor: [0, 0, 0]
        },
        didDrawPage: (data) => {
          pdf.setFontSize(14);
          pdf.text(fixThaiFont(headerLine1), centerX, 15, { align: 'center' });
        }
      });
    });

    pdf.save(filename);
  } catch (err) {
    console.error('PDF Generation Error:', err);
  }
}