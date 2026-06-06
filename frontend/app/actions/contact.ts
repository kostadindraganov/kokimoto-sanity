'use server'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function submitContact(_formData: FormData): Promise<{success: false; error: string}> {
  return {success: false as const, error: 'Not implemented — P5 will implement this'}
}
