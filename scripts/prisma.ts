#!/usr/bin/env tsx
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { config } from 'dotenv'

interface CLIArgs {
  command: string
  env: 'development' | 'test'
  extraArgs: string[]
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    showHelp()
    process.exit(0)
  }

  const command = args[0]
  const validCommands = ['generate', 'push', 'migrate', 'studio', 'seed', 'reset']

  if (!validCommands.includes(command)) {
    console.error(`❌ 未知命令: ${command}`)
    showHelp()
    process.exit(1)
  }

  let env: 'development' | 'test' = 'development'
  const extraArgs: string[] = []

  for (let i = 1; i < args.length; i++) {
    const arg = args[i]

    if (arg === '--env' && i + 1 < args.length) {
      const envValue = args[i + 1]
      if (envValue === 'test' || envValue === 'development') {
        env = envValue
        i++
      }
      else {
        console.error(`❌ 无效的环境: ${envValue}`)
        process.exit(1)
      }
    }
    else if (arg.startsWith('--env=')) {
      const envValue = arg.split('=')[1]
      if (envValue === 'test' || envValue === 'development') {
        env = envValue as 'development' | 'test'
      }
      else {
        console.error(`❌ 无效的环境: ${envValue}`)
        process.exit(1)
      }
    }
    else if (arg !== '--env') {
      extraArgs.push(arg)
    }
  }

  return { command, env, extraArgs }
}

function loadEnv(env: 'development' | 'test'): NodeJS.ProcessEnv {
  const envFile = `.env.${env}`
  const envPath = join(process.cwd(), envFile)

  if (!existsSync(envPath)) {
    console.error(`❌ 环境文件不存在: ${envFile}`)
    process.exit(1)
  }

  const result = config({ path: envPath })

  if (result.error) {
    console.error(`❌ 加载环境文件失败: ${result.error}`)
    process.exit(1)
  }

  if (!process.env.DATABASE_URL) {
    console.error(`❌ DATABASE_URL 未设置，请检查 ${envFile}`)
    process.exit(1)
  }

  console.log(`📁 使用环境文件: ${envFile}`)
  console.log(`🗄️  数据库: ${getDbName(process.env.DATABASE_URL)}`)
  console.log('')

  return process.env
}

function getDbName(connectionString: string): string {
  const match = connectionString.match(/\/([^/]+)$/)
  return match ? match[1] : 'unknown'
}

function showHelp() {
  console.log(`
用法: tsx ./scripts/prisma.ts <command> [options]

命令:
  generate     生成 Prisma Client
  push         同步 schema 到数据库
  migrate      创建迁移 (默认: dev)
  studio       打开 Prisma Studio
  seed         执行 seed 脚本
  reset        清空数据库

选项:
  --env=<环境>    环境配置 (默认: development)
                  development - 使用 .env.development
                  test        - 使用 .env.test

示例:
  tsx ./scripts/prisma.ts push              # 开发环境
  tsx ./scripts/prisma.ts push --env=test   # 测试环境
  tsx ./scripts/prisma.ts studio --env=test # 测试环境 Studio
  tsx ./scripts/prisma.ts reset --env=test  # 重置测试数据库
`)
}

function runCommand(cmd: string, args: string[], env: NodeJS.ProcessEnv): Promise<number> {
  return new Promise((resolve, reject) => {
    const fullArgs = cmd === 'prisma' ? ['prisma', ...args] : args
    const fullCmd = cmd === 'prisma' ? 'npx' : cmd

    const child = spawn(fullCmd, fullArgs, {
      env,
      stdio: 'inherit',
      shell: true,
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve(0)
      }
      else {
        reject(new Error(`命令执行失败，退出码: ${code}`))
      }
    })

    child.on('error', (error) => {
      reject(error)
    })
  })
}

async function runTsScript(scriptPath: string, env: NodeJS.ProcessEnv): Promise<void> {
  const fullPath = join(process.cwd(), scriptPath)

  if (!existsSync(fullPath)) {
    console.error(`❌ 脚本不存在: ${scriptPath}`)
    process.exit(1)
  }

  console.log(`📜 执行脚本: ${scriptPath}`)

  await runCommand('tsx', [fullPath], env)
}

async function main(): Promise<void> {
  const { command, env, extraArgs } = parseArgs()
  const envVars = loadEnv(env)

  try {
    switch (command) {
      case 'generate': {
        console.log('🔧 生成 Prisma Client...')
        await runCommand('prisma', ['generate'], envVars)
        console.log('✅ Prisma Client 生成完成')
        break
      }

      case 'push': {
        console.log('🔄 同步数据库 schema...')
        await runCommand('prisma', ['db', 'push'], envVars)
        console.log('✅ 数据库同步完成')
        break
      }

      case 'migrate': {
        console.log('📦 执行数据库迁移...')
        const migrateArgs = extraArgs.length > 0 ? extraArgs : ['dev']
        await runCommand('prisma', ['migrate', ...migrateArgs], envVars)
        console.log('✅ 迁移完成')
        break
      }

      case 'studio': {
        console.log('🎨 打开 Prisma Studio...')
        await runCommand('prisma', ['studio'], envVars)
        break
      }

      case 'seed': {
        console.log('🌱 执行 seed 脚本...')
        await runTsScript('prisma/seed.ts', envVars)
        console.log('✅ Seed 完成')
        break
      }

      case 'reset': {
        console.log('🗑️  清空数据库...')
        await runTsScript('prisma/reset.ts', envVars)
        console.log('✅ 数据库重置完成')
        break
      }
    }
  }
  catch (error) {
    if (error instanceof Error) {
      console.error(`❌ ${error.message}`)
    }
    process.exit(1)
  }
}

main()
