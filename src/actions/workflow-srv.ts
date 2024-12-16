import 'server-only';
import { WorkflowNodeRegistry, WorkflowNodeType } from '@/app/(dashboard)/workflows/editor/[id]/_components/constants';
import puppeteer, { Browser, Page } from 'puppeteer';
import * as cheerio from 'cheerio';

export interface EnvironmentExecutorState<T extends WorkflowNodeType> {
  getInput(input: T["inputs"][number]["label"]): string;
  setOutput(input: T["outputs"][number]["label"], value: string): void;
  
  getBrowser(): Browser | undefined;
  setBrowser: (browser: Browser | undefined) => void;
  
  getPage(): Page | undefined;
  setPage: (page: Page | undefined) => void;
}

export async function launchBrowserExecutor(state: EnvironmentExecutorState<typeof WorkflowNodeRegistry.LAUNCH_BROWSER>) {
  const websiteUrl = state.getInput("Website Url");
  const browser = await puppeteer.launch({
    headless: true
  });
  state.setBrowser(browser);
  const page = await browser.newPage();
  await page.goto(websiteUrl);
  state.setPage(page);
}

export async function htmlFromPageExecutor(state: EnvironmentExecutorState<typeof WorkflowNodeRegistry.HTML_FROM_PAGE>) {
  const page = state.getPage()!;
  const pageContent = await page.content();
  state.setOutput("Html", pageContent);
}

export async function extractTextFromElementExecutor(state: EnvironmentExecutorState<typeof WorkflowNodeRegistry.EXTRACT_TEXT_FROM_ELEMENT>) {
  const selector = state.getInput("Selector");
  if (!selector) throw new Error("Extract text selector not defined");
  const html = state.getInput("Html");
  if (!html) throw new Error("Extract text html not found");
  const $ = cheerio.load(html);
  const element = $(selector);
  if (!element) throw new Error("Extract text element not found");
  const content = $.text(element);
  if (!content) throw new Error("Extracted text not found");
  state.setOutput("Extracted text", content);
}