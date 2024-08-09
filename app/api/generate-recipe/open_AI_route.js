import { NextResponse } from 'next/server';
import { OpenAI } from "openai";


// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);
const openai=new OpenAI(process.env.OPENAI_API_KEY)

export async function POST(request){
    const {ingredients} = await request.json();

    const prompt = `Create a recipe using the following ingredients: ${ingredients}`;
    console.log(`Prompt ${prompt}`)
    console.log('got here');

    try{
        const response = await openai.completions.create({
            model: "gpt-4o-mini",
            prompt: prompt,
            max_tokens: 150
        
        });

        const recipe= response.data.choices[0].text.trim();
        return NextResponse.json({ recipe });
    } catch(error){
        console.error('Error generating recipe: ', error.message, error.stack);
        return NextResponse.json({error: 'Failed to generate recipe'}, {status: 500});
    }
}