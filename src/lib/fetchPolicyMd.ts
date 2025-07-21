import { supabase } from "./supabaseClientServ";
import fs from 'fs/promises'
import path from 'path'

export async function fetchPolicyMarkDown(filename: string): Promise<string> {
    try {
        const { data, error } = await supabase
            .storage
            .from('cms')
            .download(`policies/${filename}`);

        if (!error && data) {
            // Read the file content from Supabase storage
            const text = await data.text();
            return text;
        }
        
        // If there's an error or no data, throw an error
        console.error('Error fetching policy markdown:', error);
        throw new Error(`Failed to fetch ${filename}: ${error?.message || 'Unknown error'}`);
    } catch {
        // Fallback lokalny
        const localPath = path.join(process.cwd(), 'src/content/policies', filename)
        return await fs.readFile(localPath, 'utf-8')
    }
}