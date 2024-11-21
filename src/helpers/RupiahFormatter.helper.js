export const formatRupiah = (angka) => {
  let rupiah = '';
  let angkaStr = angka.toString();
  let split = angkaStr.split('.');
  let sisa = split[0].length % 3;
  let ribuan = '';
  if (sisa > 0) {
    ribuan = split[0].substr(0, sisa) + '.';
  }
  ribuan += split[0].substr(sisa).match(/\d{3}/gi).join('.');
  let desimal = typeof split[1] !== 'undefined' ? ',' + split[1] : '';
  rupiah = 'Rp. ' + ribuan + desimal + ',-';
  return rupiah;
}

export const formatRupiahTerbilang = (angka) => {
  let bilangan = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan',
    'Dembilan', 'Sepuluh', 'Sebelas'
  ];
  if (angka < 12) {
    return bilangan[angka].trim();
  } else if (angka >= 12 && angka <= 19) {
    return (bilangan[angka - 10] + ' Belas').trim();
  } else if (angka >= 20 && angka <= 99) {
    return (bilangan[Math.floor(angka / 10)] + ' Puluh ' +
      bilangan[angka % 10]).trim();
  } else if (angka >= 100 && angka <= 199) {
    return ('seratus ' + formatRupiahTerbilang(angka % 100)).trim();
  } else if (angka >= 200 && angka <= 999) {
    return (bilangan[Math.floor(angka / 100)] + ' Ratus ' +
      formatRupiahTerbilang(angka % 100)).trim();
  } else if (angka >= 1000 && angka <= 1999) {
    return ('seribu ' + formatRupiahTerbilang(angka % 1000)).trim();
  } else if (angka >= 2000 && angka <= 999999) {
    return (formatRupiahTerbilang(Math.floor(angka / 1000)) + ' Ribu ' +
      formatRupiahTerbilang(angka % 1000)).trim();
  } else if (angka >= 1000000 && angka <= 999999999) {
    return (formatRupiahTerbilang(Math.floor(angka / 1000000)) + ' Juta ' +
      formatRupiahTerbilang(angka % 1000000)).trim();
  } else {
    return 'Angka terlalu besar';
  }
}


export const formatRupiahTerbilangEng = (number) => {
  let words = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight',
    'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
    'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  let tensWords = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];
  
  if (number < 20) {
    return words[number].trim();
  } else if (number < 100) {
    return (tensWords[Math.floor(number / 10)] + ' ' + words[number % 10]).trim();
  } else if (number < 1000) {
    const remainder = number % 100;
    const remainderInWords = remainder > 0 ? ' and ' + formatRupiahTerbilangEng(remainder) : '';
    return (
      words[Math.floor(number / 100)] + ' Hundred' + remainderInWords
    ).trim();
  } else if (number < 1000000) {
    const remainder = number % 1000;
    const remainderInWords = remainder > 0 ? ' and ' + formatRupiahTerbilangEng(remainder) : '';
    return (
      formatRupiahTerbilangEng(Math.floor(number / 1000)) + ' Thousand' + remainderInWords
    ).trim();
  } else if (number < 1000000000) {
    const remainder = number % 1000000;
    const remainderInWords = remainder > 0 ? ' and ' + formatRupiahTerbilangEng(remainder) : '';
    return (
      formatRupiahTerbilangEng(Math.floor(number / 1000000)) + ' Million' + remainderInWords
    ).trim();
  } else {
    return 'Number is too large';
  }
}