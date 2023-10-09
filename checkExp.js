const expId = /^[a-z]+(\d|[a-z]|-|_)*/; // ID eq ^[a-z]([a-z]|[0-9]|-)*
const expResvW = /(def|if|while)/   //Palabra Reservada eq a [def|if|while]
const expParOp = /\(/ //Parentesis Abierto eq a [(]
const expParCl = /\)/ //Parentesis Cerrado eq a [)]
const expCompOp = /(>|<|==|<=|>=)/ //Operador comparacion eq a [>|<|==|<=|>=]
const expStrg = /^\"\w*|\s*\"$/;  //Literal eq a ["[az]*[ ]*"]
const expNumb = /^[0-9]+$/; //Numero eq a [0-9]
const expLogOp = /(true|false)/ //Operador logico eq a [true|false]
const expIf = /if\s*\((\w*|\w*)*\)\:n(\t|\s{4})(pass)$/;
//const expIf = /resvWif OpenPar id OperComp LitStrg ClosPar/ //Expresion if
const expFunc = /resvWde id OpenPar (id)*? ClosPar/  //expresion funcion
const expWhile = /resvWwh OpenPar (LogOp|id OperComp NumConst) ClosPar/ //expresion while
const expDecl = /(resvWif|resvWwh|resvWdef) OpenPar (.*) ClosPar/ //expresion declaracion

function setToken(token='', val=''){
  return {token, val}
}

function getIds(input = "") {
  //Funcion retorna id encontrados y sus posiciones
  if ((find = expId.exec(input)) !== null){
    let find2 = find;
    if (!(expResvW.test(find2[0]))){
      return (setToken('id', find2[0]))
    }
  }
  return null
}

function testOpenPar(input = ''){
  if ((find = expParOp.exec(input)) != null){
    return (setToken('OpenPar', find[0]))
  }
  return null
}

function testCompOp(input = ''){
  if ((find = expCompOp.exec(input)) != null){
    return (setToken('OperComp', find[0]))
  }
  return null
}

function testLitStrg(input = ''){
  if ((find = expStrg.exec(input)) != null){
    return (setToken('LitStrg', find[0]))
  }
  return null
}

function testNumCons(input = ''){
  if ((find = expNumb.exec(input)) != null){
    return (setToken('NumConst', find[0]))
  }
  return null
}
function testLogOp(input = ''){
  if ((find = expLogOp.exec(input)) != null){
    return (setToken('LogOp', find[0]))
  }
  return null
}

function testClosPar(input = ''){
  if ((find = expParCl.exec(input)) != null){
    return (setToken('ClosPar', find[0]))
  }
  return null
}

function testResvWord(input = ""){
  if ((find = expResvW.exec(input)) !== null){
    return (setToken('resvW'+find[0].slice(0,2), find[0]))
  }
  return null
}

function joinTokens(inputList){
  let allTokens = []

  inputList.map((element) => {
    if ((r = testResvWord(element)) !== null){
      allTokens.push(r)
    }else if ((r = testOpenPar(element)) !== null){
      allTokens.push(r)
    }else if ((r = testClosPar(element)) !== null){
      allTokens.push(r)
    }else if ((r = getIds(element)) !== null){
      allTokens.push(r)
    }else if ((r = testCompOp(element)) !== null){
      // Elimina el token OperComp
    }else if ((r = testLitStrg(element)) !== null){
      allTokens.push(r)
    }else if ((r = testNumCons(element)) !== null){
      allTokens.push(r)
    }
  })

  return allTokens
}

function getTokenStrg(tokenList){
  let tokenStrg = ""
  tokenList.map((tok)=>{
    tokenStrg = tokenStrg+tok.token+" "
  })
  return tokenStrg
}

function sintacAnalisis(tokenStrg){
  const expDecl = /(resvWif|resvWwh|resvWdef) OpenPar (.*) ClosPar/ //expresion declaracion

  if (expDecl.test(tokenStrg)){
    switch (tokenStrg[0]){
      case "if":
        return expIf.test(tokenStrg) ? ["Sintaxis correcta para declaracion if", true] : ["Sintaxis incorrecta para declaracion if", false]
      case "while":
        return expWhile.test(tokenStrg) ? ["Sintaxis correcta para declaracion de while", true] : ["Sintaxis incorrecta para declaracion de while", false]
      case "def":
        return expFunc.test(tokenStrg) ? ["Sintaxis correcta para declaracion de funcion", true] : ["Sintaxis incorrecta para declaracion de funcion", false]
      default:
    return ["Sintaxis incorrecta para declaracion", false]
    }
  }
  return ["No se reconoce la sintaxis", false]
}

export function identifSyntx(input = "") {
  //Funcion principal que identifica sintaxis y realiza los procedimientos
  let inputList = input.split(' ')
  let tokenList = joinTokens(inputList)
  let tokenStrg = getTokenStrg(tokenList)
  let sictacAnlis = sintacAnalisis(tokenStrg)
  return sictacAnlis.concat(tokenList)
}

