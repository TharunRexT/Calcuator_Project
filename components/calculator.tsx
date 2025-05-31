"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CalculatorIcon,
  History,
  Trash2,
  Sun,
  Moon,
  Plus,
  Minus,
  X,
  Divide,
  Percent,
  Square,
  SquareIcon as SquareRoot,
  ArrowLeft,
  RotateCcw,
} from "lucide-react"
import { useTheme } from "next-themes"

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [currentValue, setCurrentValue] = useState<string | null>(null)
  const [storedValue, setStoredValue] = useState<string | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [memory, setMemory] = useState<number>(0)
  const [history, setHistory] = useState<string[]>([])
  const [waitingForOperand, setWaitingForOperand] = useState(true)
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("calculator")

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        inputDigit(Number.parseInt(e.key))
      } else if (e.key === ".") {
        inputDot()
      } else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
        performOperation(e.key)
      } else if (e.key === "Enter" || e.key === "=") {
        performEquals()
      } else if (e.key === "Escape") {
        clearAll()
      } else if (e.key === "Backspace") {
        deleteLastDigit()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentValue, storedValue, operation, waitingForOperand])

  const clearAll = () => {
    setDisplay("0")
    setCurrentValue(null)
    setStoredValue(null)
    setOperation(null)
    setWaitingForOperand(true)
  }

  const clearDisplay = () => {
    setDisplay("0")
    setWaitingForOperand(true)
  }

  const deleteLastDigit = () => {
    if (waitingForOperand) return

    if (display.length > 1) {
      setDisplay(display.substring(0, display.length - 1))
      setCurrentValue(display.substring(0, display.length - 1))
    } else {
      setDisplay("0")
      setWaitingForOperand(true)
    }
  }

  const inputDigit = (digit: number) => {
    if (waitingForOperand) {
      setDisplay(digit.toString())
      setCurrentValue(digit.toString())
      setWaitingForOperand(false)
    } else {
      const newDisplay = display === "0" ? digit.toString() : display + digit.toString()
      setDisplay(newDisplay)
      setCurrentValue(newDisplay)
    }
  }

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setCurrentValue("0.")
      setWaitingForOperand(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
      setCurrentValue(currentValue + ".")
    }
  }

  const toggleSign = () => {
    const newValue = Number.parseFloat(display) * -1
    setDisplay(newValue.toString())
    setCurrentValue(newValue.toString())
  }

  const inputPercent = () => {
    const value = Number.parseFloat(display) / 100
    setDisplay(value.toString())
    setCurrentValue(value.toString())
  }

  const calculateSquareRoot = () => {
    const value = Math.sqrt(Number.parseFloat(display))
    setDisplay(value.toString())
    setCurrentValue(value.toString())
    addToHistory(`√(${display}) = ${value}`)
  }

  const calculateSquare = () => {
    const value = Math.pow(Number.parseFloat(display), 2)
    setDisplay(value.toString())
    setCurrentValue(value.toString())
    addToHistory(`(${display})² = ${value}`)
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = Number.parseFloat(display)

    if (storedValue === null) {
      setStoredValue(display)
    } else if (operation) {
      const currentValueNum = Number.parseFloat(currentValue || "0")
      const storedValueNum = Number.parseFloat(storedValue)
      let newValue: number

      switch (operation) {
        case "+":
          newValue = storedValueNum + currentValueNum
          break
        case "-":
          newValue = storedValueNum - currentValueNum
          break
        case "*":
          newValue = storedValueNum * currentValueNum
          break
        case "/":
          newValue = storedValueNum / currentValueNum
          break
        default:
          newValue = currentValueNum
      }

      setStoredValue(newValue.toString())
      setDisplay(newValue.toString())
      addToHistory(`${storedValueNum} ${operation} ${currentValueNum} = ${newValue}`)
    }

    setOperation(nextOperation)
    setWaitingForOperand(true)
  }

  const performEquals = () => {
    if (operation && storedValue !== null) {
      const currentValueNum = Number.parseFloat(currentValue || "0")
      const storedValueNum = Number.parseFloat(storedValue)
      let newValue: number

      switch (operation) {
        case "+":
          newValue = storedValueNum + currentValueNum
          break
        case "-":
          newValue = storedValueNum - currentValueNum
          break
        case "*":
          newValue = storedValueNum * currentValueNum
          break
        case "/":
          newValue = storedValueNum / currentValueNum
          break
        default:
          newValue = currentValueNum
      }

      setDisplay(newValue.toString())
      addToHistory(`${storedValueNum} ${operation} ${currentValueNum} = ${newValue}`)

      setStoredValue(null)
      setCurrentValue(newValue.toString())
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const memoryClear = () => {
    setMemory(0)
  }

  const memoryRecall = () => {
    setDisplay(memory.toString())
    setCurrentValue(memory.toString())
    setWaitingForOperand(true)
  }

  const memoryAdd = () => {
    setMemory(memory + Number.parseFloat(display))
  }

  const memorySubtract = () => {
    setMemory(memory - Number.parseFloat(display))
  }

  const addToHistory = (entry: string) => {
    setHistory((prev) => [entry, ...prev])
  }

  const clearHistory = () => {
    setHistory([])
  }

  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.95 },
  }

  return (
    <Card className="w-full max-w-md shadow-xl overflow-hidden border-0">
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800">
            <TabsList className="grid grid-cols-2 w-40">
              <TabsTrigger value="calculator" className="flex items-center gap-1">
                <CalculatorIcon className="h-4 w-4" />
                <span>Calc</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1">
                <History className="h-4 w-4" />
                <span>History</span>
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>

          <TabsContent value="calculator" className="m-0">
            <div className="p-4 bg-slate-200 dark:bg-slate-700">
              <div className="text-right font-mono text-3xl h-16 flex items-center justify-end overflow-x-auto">
                {display}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1 p-2 bg-slate-50 dark:bg-slate-900">
              {/* Memory Row */}
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="outline" className="w-full h-12 text-sm font-medium" onClick={memoryClear}>
                  MC
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="outline" className="w-full h-12 text-sm font-medium" onClick={memoryRecall}>
                  MR
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="outline" className="w-full h-12 text-sm font-medium" onClick={memoryAdd}>
                  M+
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="outline" className="w-full h-12 text-sm font-medium" onClick={memorySubtract}>
                  M-
                </Button>
              </motion.div>

              {/* Clear Row */}
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="destructive" className="w-full h-12" onClick={clearAll}>
                  C
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="secondary" className="w-full h-12" onClick={clearDisplay}>
                  CE
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="secondary" className="w-full h-12" onClick={deleteLastDigit}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="secondary" className="w-full h-12" onClick={() => performOperation("/")}>
                  <Divide className="h-5 w-5" />
                </Button>
              </motion.div>

              {/* Advanced Row */}
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="secondary" className="w-full h-12" onClick={calculateSquareRoot}>
                  <SquareRoot className="h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="secondary" className="w-full h-12" onClick={calculateSquare}>
                  <Square className="h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="secondary" className="w-full h-12" onClick={inputPercent}>
                  <Percent className="h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="secondary" className="w-full h-12" onClick={() => performOperation("*")}>
                  <X className="h-5 w-5" />
                </Button>
              </motion.div>

              {/* Number Rows */}
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="outline" className="w-full h-12" onClick={() => inputDigit(7)}>
                  7
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="outline" className="w-full h-12" onClick={() => inputDigit(8)}>
                  8
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="outline" className="w-full h-12" onClick={() => inputDigit(9)}>
                  9
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="secondary" className="w-full h-12" onClick={() => performOperation("-")}>
                  <Minus className="h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="outline" className="w-full h-12" onClick={() => inputDigit(4)}>
                  4
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="outline" className="w-full h-12" onClick={() => inputDigit(5)}>
                  5
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="outline" className="w-full h-12" onClick={() => inputDigit(6)}>
                  6
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="secondary" className="w-full h-12" onClick={() => performOperation("+")}>
                  <Plus className="h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="outline" className="w-full h-12" onClick={() => inputDigit(1)}>
                  1
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="outline" className="w-full h-12" onClick={() => inputDigit(2)}>
                  2
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="outline" className="w-full h-12" onClick={() => inputDigit(3)}>
                  3
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1 row-span-2">
                <Button
                  variant="primary"
                  className="w-full h-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={performEquals}
                >
                  =
                </Button>
              </motion.div>

              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="outline" className="w-full h-12" onClick={toggleSign}>
                  +/-
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="outline" className="w-full h-12" onClick={() => inputDigit(0)}>
                  0
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} initial="initial" whileTap="tap" className="col-span-1">
                <Button variant="outline" className="w-full h-12" onClick={inputDot}>
                  .
                </Button>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="m-0 p-0">
            <div className="flex items-center justify-between p-4 bg-slate-200 dark:bg-slate-700">
              <h3 className="text-lg font-medium">Calculation History</h3>
              <Button variant="ghost" size="sm" onClick={clearHistory} className="flex items-center gap-1">
                <Trash2 className="h-4 w-4" />
                <span>Clear</span>
              </Button>
            </div>
            <ScrollArea className="h-[400px] p-4 bg-slate-50 dark:bg-slate-900">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
                  <RotateCcw className="h-12 w-12 mb-2 opacity-20" />
                  <p>No calculation history yet</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {history.map((item, index) => (
                    <li key={index} className="p-3 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
