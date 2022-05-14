import { Processor } from 'windicss/lib'

export function generateStyles(htmlClasses) {
    // Get windi processor
    const processor = new Processor()
  
    // Process the HTML classes to an interpreted style sheet
    const interpretedSheet = processor.interpret(htmlClasses).styleSheet.build()
  
    return interpretedSheet
  }