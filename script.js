const BELPOST_API = "https://webservices.belpost.by/searchEn.aspx?search=";

class FormError extends Error {}

$(document).ready(function(){
    makeTable();
    $("#add-track").bind('click',function(){
        $("#tracknumber").removeClass("error");
        $("#error").html("");
        const number = $("#tracknumber").val();
        const comment = $("#comment").val();
        try{
            if(!/^[A-Z]{2}\d{9}[A-Z]{2}$/.test(number)){
                throw new FormError("Неверный формат номера");
            }
            addNumber(number, comment);
            $("#tracknumber").val("");
            makeTable();
        }
        catch(e){
            if(e instanceof FormError){
                $("#tracknumber").addClass("error");
                $("#error").html(e);
            }else{
                $("#error").html("Неизвестная ошибка");
                throw e;
            }
        }
        
    });
});
function getNumbers(){
    let data = JSON.parse(window.localStorage.getItem("tracks"));
    if(data === null){
        return [];
    }
    return data;
}
function setNumbers(numbers){
    window.localStorage.setItem("tracks", JSON.stringify(numbers));
}
function addNumber(id, comment){
    let numbers = getNumbers();
    if(numbers.find(n => n.id == id) !== undefined){
        throw new Error("Номер уже добавлен");
    }
    numbers.push({
        id: id,
        c: comment
    });
    setNumbers(numbers);
}
function removeNumber(id){
    let numbers = getNumbers();
    if(!confirm(`Удалить ${id} из списка?`)){
        return;
    }
    numbers = numbers.filter(n => n.id != id);
    setNumbers(numbers);
    makeTable();
}
function makeTable(){
    const numbers = getNumbers();
    let table = "<thead><tr><th>Номер</th><th>Комментарий</th><th>Действия</th><tr></thead><tbody>";
    for(let number of numbers){
        table += getTableRecord(number);
    }
    table += "</tbody>";
    $("#table").html(table);
}
function getTableRecord(number){
    let actions = `<a href="${getTrackUrl(number.id)}" target="_blank">Отследить</a> `;
    actions += `<a href="#" onclick="removeNumber('${number.id}')">Удалить</a>`;
    return `<tr><td>${number.id}</td><td>${number.c}</td><td>${actions}</td></tr>`;
}
function getTrackUrl(id){
    return BELPOST_API + id;
}