export function realMask(valor){  
    var num = 0;
    if(typeof valor === 'number' && !isNaN(valor)){
        num = valor
    }
    else{
        const apenasDigitos = String(valor).replace(/[^\d]/g, "");
        if(String(valor).includes(",")){
            num = parseFloat(apenasDigitos) / 100;
        } else {
            num = parseFloat(apenasDigitos);
        }
    }
    
    

    // Converte para formato "R$ 1.234,56"
    return num.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
  });
}

export function cpfMask(cpf){
   
    return cpf
        .replace(/\D/g, '') 
        .slice(0, 11)  
        .replace(/(\d{3})(\d)/, '$1.$2') 
        .replace(/(\d{3})(\d)/, '$1.$2') 
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 
}