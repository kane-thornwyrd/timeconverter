const inputField: HTMLInputElement = document.getElementById('input') as HTMLInputElement
const outputField: HTMLInputElement = document.getElementById('output') as HTMLInputElement

interface stringVars {
  [index: string]: any
}

function tpl(template: TemplateStringsArray, ...keys: string[]): (vars: stringVars) => string{
  return function(vars: stringVars) {
    let temp = template.slice();
    keys.forEach((key: string, index:number) => {
      temp[index] = temp[index] + vars[key];
    });
    if(vars['debug'] !== undefined) {
      const debugString = typeof vars['debug'] === 'object' && vars['debug'].length > 0 ?
        vars['debug'].join('\n') :
        vars['debug'] ;
      temp.push(`<br />DEBUG:<br /><pre>${debugString}</pre>`)
    }
    return temp.join('');
  }
}

const extractDurationPartsRegex = /^(?<days>\d+d(ay(s)?)?)?(((?<hours>\d{1,})[h:]?(?<minutes>\d{1,}(m(in)?)?)?)|((?<frachours>\d*)[\.,](?<hourdecimals>\d*[1-9]+)?0*))?$/i

function convertDurationObjectToMinutes(durationObject: {days?: string, hours?: string, minutes?: string, frachours?: string, hourdecimals?:string}): number {
  const {days, hours, minutes, frachours, hourdecimals} = durationObject
  return parseInt(days || "0", 10) * 1440 +
  parseInt(hours || frachours  || "0", 10) * 60 +
  parseInt(minutes || "0", 10) +
  parseFloat(`0.${hourdecimals}` || "0.0") * 60
}

function extractDurationMinutes(extractorRegex: RegExp): (parsingCallback: Function) => (str: string) => number {
  return function(parsingCallback: Function): (str: string) => number {
    return function(str: string): number {
      const result = extractorRegex.exec(str)
      if(result === undefined || result === null || result.groups === undefined) return 0
      return parsingCallback(result.groups)
    }
  }
}

const getMinutes = extractDurationMinutes(extractDurationPartsRegex)(convertDurationObjectToMinutes)

function minutesToDurations(min: number): {days: number, hours: number, minutes: number} {
  return {
    days: Math.trunc(min/1440),
    hours: Math.trunc((min%1440)/60),
    minutes: Math.trunc(min%60)
  }
}

function doesRegexMatch(regex: RegExp): (params: string) => boolean {
  return function (params: string){
    const output = regex.exec(params)
    return !!(output && output.length > 0)
  }
}

const template = tpl`is equivalent to ${'days'} days, ${'hours'} hours and ${'minutes'} minutes`

function renderToHtml(htmlElement: HTMLElement): (text: string) => void {
  return (text: string) => htmlElement.innerHTML = text
}

const display = renderToHtml(outputField)

const updateDisplay =
  (target: Function) =>
  (templateEngine: Function) =>
  (data: Object) =>
    target(templateEngine(data))

const updateOutputField = updateDisplay(display)(template)

inputField.addEventListener('keyup', (_ev) => {
  const val = inputField.value
  updateOutputField(minutesToDurations(getMinutes(val)))
})