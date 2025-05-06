import { getRequestIP, getRequestHeader } from 'h3'

// Define a type for our IP data structure
interface IpData {
  'x-forwarded-for'?: string;
  'x-real-ip'?: string;
  'cf-connecting-ip'?: string;
  'x-vercel-forwarded-for'?: string;
  'true-client-ip'?: string;
  'x-client-ip'?: string;
  'direct-ip': string;
  'x-forwarded-for-array': string[];
  'x-vercel-forwarded-for-array': string[];
  'x-forwarded-for-first'?: string;
  'x-vercel-forwarded-for-first'?: string;
  [key: string]: string | string[] | undefined;
}

export default defineEventHandler((event) => {
  // Get raw header values
  const xForwardedFor = getRequestHeader(event, 'x-forwarded-for')
  const xVercelForwardedFor = getRequestHeader(event, 'x-vercel-forwarded-for')
  
  // Collect all possible IP headers
  const ipHeaders = {
    'x-forwarded-for': xForwardedFor,
    'x-real-ip': getRequestHeader(event, 'x-real-ip'),
    'cf-connecting-ip': getRequestHeader(event, 'cf-connecting-ip'),
    'x-vercel-forwarded-for': xVercelForwardedFor,
    'true-client-ip': getRequestHeader(event, 'true-client-ip'),
    'x-client-ip': getRequestHeader(event, 'x-client-ip'),
    'direct-ip': getRequestIP(event)?.replace('::ffff:', '') || 'unknown'
  }
  
  // Process the forwarded headers into arrays
  const ipData: IpData = {
    ...ipHeaders,
    'x-forwarded-for-array': xForwardedFor ? xForwardedFor.split(',').map(ip => ip.trim()) : [],
    'x-vercel-forwarded-for-array': xVercelForwardedFor ? xVercelForwardedFor.split(',').map(ip => ip.trim()) : []
  } as IpData
  
  // Add first IPs for convenience
  if (ipData['x-forwarded-for-array'].length > 0) {
    ipData['x-forwarded-for-first'] = ipData['x-forwarded-for-array'][0]
  }
  
  if (ipData['x-vercel-forwarded-for-array'].length > 0) {
    ipData['x-vercel-forwarded-for-first'] = ipData['x-vercel-forwarded-for-array'][0]
  }
  
  // Add the IP data to the event context
  event.context.reqIpData = ipData
  
  // Determine a "best guess" IP for convenience
  event.context.reqIp = 
    ipData['x-vercel-forwarded-for-first'] || 
    ipData['x-forwarded-for-first'] || 
    ipData['cf-connecting-ip'] || 
    ipData['x-real-ip'] || 
    ipData['true-client-ip'] || 
    ipData['x-client-ip'] || 
    ipData['direct-ip']
})
