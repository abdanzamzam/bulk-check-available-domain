const xl = require("excel4node");
const wb = new xl.Workbook();
const ws = wb.addWorksheet("Worksheet Name");
const domainNames = require("./domains"); 

const data = [];
const headingColumnNames = ["No", "Domain Name", "Available"];

const checkDomainAvailable = async (domain) => {
    const response = await fetch("https://whois.domainesia.com/?t=f450e385cd02c292ff19d5e4fb3676dd&domain=" + domain);

    if (!response.ok) {
        console.log(response.message);
    }

    const data = await response.json();

    if (data.availability === 'available') {
        return true;
    } else {
        return false;
    }
}

const start = async () => {
    for (let i = 0; i < domainNames.length; i++) {
        const domain = domainNames[i];

        const res = await checkDomainAvailable(domain);

        const num = i + 1;

        const detailDomain = {
            no: num.toString(),
            name: domain,
            ket: res ? 'Yes' : 'No',
        }

        data.push(detailDomain);
    }

    //Write Column Title in Excel file
    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws.cell(1, headingColumnIndex++)
            .string(heading)
    });

    //Write Data in Excel file
    let rowIndex = 2;
    data.forEach(record => {
        let columnIndex = 1;
        Object.keys(record).forEach(columnName => {
            ws.cell(rowIndex, columnIndex++)
                .string(record[columnName])
        });
        rowIndex++;
    });

    wb.write('domains.xlsx');
}

start();