import { buildPrompt } from '../src/lib/prompts/factory';
import { generateContent } from '../src/lib/ai/generate';
import { parseAndValidateAiBatch } from '../src/lib/validators/parseAndValidateAiBatch';

async function main() {
    const archetypeId = 'cmj8gb7xq002qhfec4l6v8yfa'; // Curves, Tangents & Motion in Space
    const band = '400_600';
    const count = 3;

    console.log('--- Stage 1: Problem Generation Test ---');
    console.log(`Archetype ID: ${archetypeId}`);
    console.log(`Band: ${band}`);
    console.log(`Count: ${count}`);

    try {
        console.log('\n1. Building Prompt...');
        const prompt = await buildPrompt({
            archetypeId,
            type: 'MCQ',
            band,
            count,
        });
        console.log('Prompt successfully built.');
        // console.log(prompt);

        console.log('\n2. Generating Content (LLM)...');
        const { content, usage } = await generateContent({ prompt });
        console.log('Content successfully generated.');
        console.log('Usage:', usage);

        console.log('\n3. Validating AI Batch...');
        const batch = parseAndValidateAiBatch(content);
        console.log('Batch successfully validated!');
        console.log('\nGenerated Problems:');
        batch.problems.forEach((p, i) => {
            console.log(`\n--- Problem ${i + 1} ---`);
            console.log(`Prompt: ${p.promptLatex}`);
            console.log(`Seed Rating: ${p.seedRating}`);
            if (p.type === 'MCQ' || !p.type) {
                console.log(`Correct Choice: ${p.correctChoice}`);
                p.choices.forEach(c => console.log(`  ${c.id}: ${c.latex}`));
            }
        });

        console.log('\n--- SUCCESS: Stage 1 Win Condition Met ---');
    } catch (error: any) {
        console.error('\n--- FAILED ---');
        console.error(error.message);
        if (error.issues) {
            console.error('Validation Issues:', JSON.stringify(error.issues, null, 2));
        }
    }
}

main();
