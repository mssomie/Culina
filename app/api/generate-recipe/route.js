import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';


const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

export async function POST(request){
    try{

        // Parse the JSON payload from the request
        const { ingredients } = await request.json();

        // Validate the ingredients input
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0){
            return NextResponse.json(
                {error: 'Invalid argument provided'},
                { status: 400 }
            );
        }

        // Convert ingredients to a string if they are objects
        const ingredientsString = ingredients.map(ingredient=>ingredient.name || ingredient)
        .join(', ')
        const prompt = `Create a detailed, step-by-step recipe using the following ingredients: ${ingredientsString}. Include measurements and cooking times.`;


        // Get the recipe using Groq AI
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            model: 'llama3-70b-8192',
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1, 
            stream: false,
            stop: null,
        });

        // Extract the recipe from the response
        const recipe = chatCompletion.choices[0]?.message?.content?.trim();
       

        // Handle case for when recipe is not generated
        if (!recipe){
            return NextResponse.json(
                    {error: 'failed to generate recipe'},
                    {status: 500}
                
            );
        }
            // Return generated recipe as a JSON response
        return NextResponse.json({recipe})
        
    }catch(error){
            console.error('Error generating recipe: ', error);
            return NextResponse.json(
                {error: 'Internal server error'},
                {status: 500}
            );
        }
        }
    

  