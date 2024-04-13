export const mesesdoano = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
]

export function getToday(){
    return "2021-06-07";
}

export function formatMonth(isomonth: string){
    const [year, month] = isomonth.split("-");
    return `${mesesdoano[parseInt(month) - 1]} de ${year}`;
}

export function addMonths(month: string, increment: number){
    let jsDate = new Date(month + "-01T12:00:00");
    jsDate.setMonth(jsDate.getMonth() + increment);
    return `${jsDate.getFullYear()}-${(jsDate.getMonth() + 1).toString().padStart(2, "0")}`;
}