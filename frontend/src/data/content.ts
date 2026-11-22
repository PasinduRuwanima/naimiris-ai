import type { DiseaseInfo, Source } from '../lib/api';

export const references = {
  kew: { title: 'Royal Botanic Gardens, Kew · Capsicum frutescens', url: 'https://powo.science.kew.org/taxon/316959-2' },
  local: { title: 'Lakpura · Nai Miris cultural context (secondary source)', url: 'https://www.lakpura.com/pages/capsicum-frutescens' },
  umn: { title: 'University of Minnesota Extension · Growing peppers', url: 'https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-peppers' },
  umd: { title: 'University of Maryland Extension · Growing peppers', url: 'https://extension.umd.edu/resource/growing-peppers-home-garden' },
  ipm: { title: 'UC IPM · Peppers: pests and disorders', url: 'https://ipm.ucanr.edu/home-and-landscape/peppers/' },
  mosaic: { title: 'UC IPM · Mosaic viruses of peppers and eggplants', url: 'https://ipm.ucanr.edu/home-and-landscape/mosaic-viruses-of-peppers-and-eggplants/' },
  bacteria: { title: 'UC IPM · Bacterial spot of peppers', url: 'https://ipm.ucanr.edu/agriculture/peppers/bacterial-spot/' },
  mildew: { title: 'UC IPM · Powdery mildew of peppers', url: 'https://ipm.ucanr.edu/agriculture/peppers/powdery-mildew/' },
  aphids: { title: 'UC IPM · Aphids', url: 'https://ipm.ucanr.edu/home-and-landscape/aphids/' },
} satisfies Record<string, Source>;

export const guideSteps = [
  { id: 'start', title: 'Start with your growing space', text: 'Plan for sunlight, drainage and access to water. Local conditions and the actual cultivar matter.', tip: 'Ask a local agricultural extension officer about Sri Lankan cultivar-specific recommendations.', source: references.umd, icon: 'sprout' },
  { id: 'seeds', title: 'Choose seeds you can trace', text: 'Record the variety and supplier. Prefer healthy planting material.', tip: 'Disease-free seed and transplants help avoid introducing bacterial spot.', source: references.bacteria, icon: 'sprout' },
  { id: 'germination', title: 'Give germination a good start', text: 'Follow the seed supplier’s instructions. Pepper seedlings need warmth and adequate light.', tip: 'Local germination temperatures and timings require review.', source: references.umn, icon: 'sun' },
  { id: 'nursery', title: 'Prepare a healthy nursery', text: 'Choose sturdy seedlings. Avoid plants with leaf spots or visible stress.', tip: 'Label trays with seed source and sowing date.', source: references.umn, icon: 'sprout' },
  { id: 'soil', title: 'Prepare the soil', text: 'Use a well-drained site. Soil tests guide nutrition; mature compost can improve soil.', tip: 'Avoid fresh manure and fertilizers containing weed killers.', source: references.umn, icon: 'leaf' },
  { id: 'planting', title: 'Move seedlings into their space', text: 'Use healthy transplants in warm conditions. Containers must drain freely.', tip: 'Plant spacing for your Nai Miris cultivar requires local review.', source: references.umd, icon: 'sprout' },
  { id: 'sunlight', title: 'Find a sunny position', text: 'Peppers need a sunny position. Consider heat exposure alongside available light.', tip: 'Observe your growing space throughout the day.', source: references.umd, icon: 'sun' },
  { id: 'watering', title: 'Water thoughtfully', text: 'Aim for even soil moisture. Adjust to rain, soil and container conditions rather than a fixed schedule.', tip: 'Direct water toward soil and limit unnecessary foliage wetting.', source: references.umd, icon: 'water' },
  { id: 'fertilizer', title: 'Feed according to need', text: 'Use soil tests and local advice. Excess nitrogen can favour leaves over fruit.', tip: 'Exact fertilizer amounts and schedules require local agronomic review.', source: references.umn, icon: 'leaf' },
  { id: 'pests', title: 'Look closely for pests', text: 'Inspect new growth for insects and damage before choosing a response.', tip: 'Broad-spectrum spraying can harm natural enemies of aphids.', source: references.aphids, icon: 'bug' },
  { id: 'prevention', title: 'Prevent avoidable disease spread', text: 'Use healthy planting material. Reducing splash can limit bacterial spot spread.', tip: 'Spots alone cannot establish a diagnosis; seek confirmation.', source: references.bacteria, icon: 'shield' },
  { id: 'maintenance', title: 'Support and observe your plants', text: 'Support brittle stems as needed and manage weeds.', tip: 'Record changes in leaves, growth and fruit alongside photographs.', source: references.umd, icon: 'leaf' },
  { id: 'harvesting', title: 'Harvest with care', text: 'Choose maturity for the intended use. Cut pods instead of pulling to protect branches.', tip: 'Local harvest timelines vary and require cultivar-specific review.', source: references.umd, icon: 'sprout' },
  { id: 'mistakes', title: 'Avoid common growing mistakes', text: 'Avoid poor drainage, excessive fertilizer and unhealthy transplants.', tip: 'Yellow leaves alone do not prove a nutrient deficiency.', source: references.umn, icon: 'shield' },
];

export const categories = ['All topics', 'Fungal', 'Bacterial', 'Viral', 'Pests', 'Nutritional', 'Healthy reference'] as const;
export const diseases: DiseaseInfo[] = [
  { id: 'powdery-mildew', name: 'Powdery mildew', category: 'Fungal', description: 'A fungal disease affecting pepper leaves. A general pepper reference, not a local diagnosis.', symptoms: ['White powdery patches, often on leaf undersides.', 'Yellow or brown patches above; leaves may drop.'], causes: ['Leveillula taurica, a fungus with wind-dispersed spores.'], management: ['Monitor undersides and seek confirmation early.', 'Ask an adviser about a locally appropriate management plan.'], prevention: ['Regular inspection helps detect early changes.', 'Sanitation alone may not prevent this disease.'], sources: [references.mildew] },
  { id: 'bacterial-spot', name: 'Bacterial spot', category: 'Bacterial', description: 'A bacterial disease affecting pepper leaves, stems and fruit.', symptoms: ['Water-soaked spots that later become brown.', 'Raised, rough fruit spots.'], causes: ['Xanthomonas bacteria on seed or transplants; wet foliage favours spread.'], management: ['Confirm the cause before selecting treatment.', 'Reduce splash and avoid overhead irrigation where feasible.'], prevention: ['Start with disease-free planting material.', 'Discuss rotation with a local adviser.'], sources: [references.bacteria] },
  { id: 'mosaic-symptoms', name: 'Mosaic & distorted leaves', category: 'Viral', description: 'A symptom pattern associated with several viruses; appearance does not identify a virus.', symptoms: ['Uneven leaf colour or distorted growth.'], causes: ['Several viruses and other stresses can produce overlapping signs.'], management: ['Record symptom spread and seek a qualified diagnosis.'], prevention: ['Use healthy planting material.', 'Identify insect activity and seek advice on preventing spread.'], sources: [references.mosaic] },
  { id: 'aphids', name: 'Aphids & curled growth', category: 'Pests', description: 'A pest-related observation, not a disease label. Inspect for insects.', symptoms: ['Small soft-bodied insects on new growth.', 'Curled leaves or sticky honeydew.'], causes: ['Aphids feeding on tender plant tissues.'], management: ['Confirm insects are present and inspect for natural enemies.', 'Avoid unnecessary broad-spectrum insecticides.'], prevention: ['Monitor new growth and protect beneficial insects.'], sources: [references.aphids] },
  { id: 'yellowing', name: 'Yellowing leaves', category: 'Nutritional', description: 'A nonspecific symptom. Yellow leaves do not prove a nutrient deficiency.', symptoms: ['Pale or yellow leaves; patterns vary.'], causes: ['Nutrient, environmental or disease-related causes require assessment.'], management: ['Review moisture and record affected leaves.', 'Request soil testing before adding fertilizer.'], prevention: ['Use soil-test-based nutrition and good drainage.'], sources: [references.umn, references.ipm] },
  { id: 'healthy', name: 'A healthy-looking plant', category: 'Healthy reference', description: 'An observation checklist, not proof that a plant is pathogen-free.', symptoms: ['Observe new growth, leaf colour and fruit condition over time.'], causes: ['Appearance varies by cultivar, stage and conditions.'], management: ['Keep notes and photographs as a baseline.'], prevention: ['Use healthy planting material and suitable growing conditions.'], sources: [references.umd, references.ipm] },
];
export const candidateDatasets: Source[] = [
  { title: 'Mendeley · Chilli Leaf Disease Image Dataset, v1', url: 'https://data.mendeley.com/datasets/tm3v4zmh7c/1' },
  { title: 'Hugging Face · Project-AgML COLD', url: 'https://huggingface.co/datasets/Project-AgML/COLD_chili_leaf_disease_classification' },
  { title: 'Kaggle · Sri Lankan Nai Miris agronomic dataset', url: 'https://www.kaggle.com/datasets/isurujayasuriya452/sri-lankan-nai-miris-agronomic-dataset' },
];
