export interface Herb {
  id: string;
  name: string;
  quechuaName: string;
  scientificName: string;
  category: 'digestiva' | 'respiratoria' | 'energetica' | 'sagrada' | 'relajante';
  categoryLabelEs: string;
  categoryLabelEn: string;
  propertiesEs: string[];
  propertiesEn: string[];
  descriptionEs: string;
  descriptionEn: string;
  traditionalUseEs: string;
  traditionalUseEn: string;
  preparationEs: string;
  preparationEn: string;
  sumaqPracticeEs: string;
  sumaqPracticeEn: string;
  tagColor: string;
}

export const HERBS_DATA: Herb[] = [
  {
    id: 'muna',
    name: 'Muña',
    quechuaName: 'Muña / Minthostachys mollis',
    scientificName: 'Minthostachys mollis',
    category: 'digestiva',
    categoryLabelEs: 'Digestiva & Mal de Altura',
    categoryLabelEn: 'Digestive & Altitude Remedy',
    propertiesEs: ['Carminativa', 'Antiespasmódica', 'Rica en calcio y fósforo', 'Aroma mentolado fresco'],
    propertiesEn: ['Carminative', 'Antispasmodic', 'Rich in calcium & phosphorus', 'Fresh minty essence'],
    descriptionEs: 'La menta sagrada de las alturas andinas. Crece silvestre sobre los 2,800 msnm y es el aliado indispensable para cualquier viajero en Cusco. Alivia de inmediato los dolores estomacales y la pesadez provocada por la altitud.',
    descriptionEn: 'The sacred mint of the high Andes. Growing wild above 2,800 meters, it is an essential ally for every traveler in Cusco. It provides immediate relief for digestive distress and altitude sickness.',
    traditionalUseEs: 'Infusión caliente después de las comidas; hojas secas almacenadas junto a las papas cosechadas para repeler insectos de forma 100% natural.',
    traditionalUseEn: 'Steeped into hot tea after meals; dried leaves placed with harvested potatoes to ward off pests completely naturally.',
    preparationEs: 'Infundir 4 a 6 hojas frescas en agua hirviendo durante 4 minutos. Inhalar el vapor antes de beber lentamente.',
    preparationEn: 'Infuse 4 to 6 fresh leaves in boiling spring water for 4 minutes. Inhale the aromatic steam before sipping gently.',
    sumaqPracticeEs: 'En nuestro huerto de Chillca cosechamos la muña silvestre al amanecer y preparamos aceites para masajes descontracturantes post-caminata.',
    sumaqPracticeEn: 'In our Chillca garden, we harvest wild muña at dawn and formulate soothing massage oils for post-trek relief.',
    tagColor: '#059669'
  },
  {
    id: 'coca',
    name: 'Hoja de Coca',
    quechuaName: 'Kuka / Erythroxylum coca',
    scientificName: 'Erythroxylum coca',
    category: 'sagrada',
    categoryLabelEs: 'Planta Sagrada & Energética',
    categoryLabelEn: 'Sacred Medicine & Vital Energy',
    propertiesEs: ['Oxigenante celular', 'Nutriente mineral', 'Conector espiritual', 'Equilibrador del soroche'],
    propertiesEn: ['Cellular oxygenator', 'Mineral powerhouse', 'Spiritual conduit', 'Soroche balancer'],
    descriptionEs: 'El pilar sagrado de la cosmovisión andina. No es una droga: en su estado natural es una de las hojas más ricas en vitaminas A, B, C, hierro y calcio del planeta. En la cultura quechua, representa el respeto, la reciprocidad (Ayni) y la comunicación con la Pachamama.',
    descriptionEn: 'The sacred pillar of Andean worldview. In its pure leaf form, it is an extraordinary superfood packed with vitamins A, B, C, bioavailable calcium, and iron. It embodies sacred reciprocity (Ayni) and spiritual reverence.',
    traditionalUseEs: 'El sagrado "Pikcho" o masticado ritual con llipta alcalina para largas jornadas de trabajo o caminatas en las cumbres nevadas; lectura oracular y ofrendas de Kintu.',
    traditionalUseEn: 'Ritual chewing ("Pikcho") with alkaline ashes for endurance on mountain passes; oracle reading and traditional Kintu offerings.',
    preparationEs: 'Mate de tres hojas sagradas enteras infusionadas en agua a 85°C. Se acompaña de meditación y agradecimiento a la tierra.',
    preparationEn: 'Brew three intact leaves (Kintu) in hot water at 85°C. Sip mindfully while extending gratitude to Mother Earth.',
    sumaqPracticeEs: 'Iniciamos cada una de nuestras expediciones con una ceremonia de Kintu guiada por Paqos locales para pedir permiso a los Apus.',
    sumaqPracticeEn: 'We open every journey with an authentic Kintu ceremony guided by Quechua Paqos to request safe passage from the sacred peaks.',
    tagColor: '#16a34a'
  },
  {
    id: 'sasawi',
    name: 'Sasawi',
    quechuaName: 'Sasawi / Lepechinia meyenii',
    scientificName: 'Lepechinia meyenii',
    category: 'respiratoria',
    categoryLabelEs: 'Respiratoria & Bronquial',
    categoryLabelEn: 'Respiratory & Bronchial Elixir',
    propertiesEs: ['Descongestionante', 'Expectorante', 'Calmante pulmonar', 'Tónica para el frío'],
    propertiesEn: ['Decongestant', 'Expectorant', 'Lung-calming', 'Warming tonic against mountain cold'],
    descriptionEs: 'Planta aromática de hojas aterciopeladas que florece en las laderas rocosas del Valle Sagrado. Los pobladores locales la han utilizado durante generaciones para combatir los resfríos intensos y proteger los pulmones en las heladas andinas.',
    descriptionEn: 'An intensely aromatic herb with velvety leaves thriving on the rocky slopes of the Sacred Valley. Highland families have used it for centuries to cure stubborn chest coughs and protect the lungs during freezing mountain nights.',
    traditionalUseEs: 'Vapores bronquiales con piedras calientes en chozas tradicionales; jarabes espesos endulzados con miel silvestre de abeja andina.',
    traditionalUseEn: 'Steam inhalation with heated stones in traditional adobe huts; natural thick syrups sweetened with wild mountain honey.',
    preparationEs: 'Hervir un puñado durante 3 minutos y realizar inhalaciones cubriendo la cabeza con una manta de lana.',
    preparationEn: 'Simmer a handful for 3 minutes and inhale deeply under a handwoven blanket.',
    sumaqPracticeEs: 'Forma parte indispensable del taller de alquimia botánica en Sumaq Kawsay, donde elaboramos el bálsamo balsámico para el pecho.',
    sumaqPracticeEn: 'A cornerstone of our botanical alchemy workshop, where visitors craft their own soothing herbal chest balm.',
    tagColor: '#2563eb'
  },
  {
    id: 'markhu',
    name: 'Markhu',
    quechuaName: 'Markhu / Ambrosia arborescens',
    scientificName: 'Ambrosia arborescens',
    category: 'relajante',
    categoryLabelEs: 'Antiinflamatoria & Muscular',
    categoryLabelEn: 'Anti-inflammatory & Muscle Relief',
    propertiesEs: ['Analgésica tópica', 'Desinflamante articular', 'Limpieza energética', 'Circulatoria'],
    propertiesEn: ['Topical analgesic', 'Joint anti-inflammatory', 'Energetic cleansing', 'Circulatory stimulator'],
    descriptionEs: 'Arbusto silvestre de hojas finamente divididas con un aroma penetrante. En la medicina tradicional cusqueña es considerada la planta reina para aliviar los dolores musculares tras cruzar pasos de alta montaña.',
    descriptionEn: 'A resilient wild shrub with feathery leaves and an unmistakable earthy fragrance. Regarded in traditional Cusco medicine as the supreme remedy for aching muscles after crossing alpine passes.',
    traditionalUseEs: 'Cataplasmas tibias de hojas maceradas con alcohol o sal de Maras aplicadas directamente sobre rodillas, tobillos y espalda.',
    traditionalUseEn: 'Warm poultices of crushed leaves mixed with Maras pink salt applied directly to knees, ankles, and sore backs.',
    preparationEs: 'Maceración de hojas en aguardiente de caña durante 21 días al sol para obtener un linimento potente.',
    preparationEn: 'Macerating crushed leaves in natural sugarcane spirit for 21 days under the high-altitude sun.',
    sumaqPracticeEs: 'Ofrecemos baños de pies con Markhu caliente y sales de Maras a los viajeros al finalizar nuestras cabalgatas en Chillca.',
    sumaqPracticeEn: 'We treat riders to rejuvenating foot soaks infused with warm Markhu decoctions and Maras salt after our trail rides.',
    tagColor: '#d97706'
  },
  {
    id: 'ayrampo',
    name: 'Ayrampo',
    quechuaName: 'Ayrampu / Tunilla soehrensii',
    scientificName: 'Tunilla soehrensii',
    category: 'digestiva',
    categoryLabelEs: 'Febrífuga & Tinte Natural',
    categoryLabelEn: 'Fever Reducer & Natural Dye',
    propertiesEs: ['Regulador térmico', 'Alivio de aftas y garganta', 'Pigmento violeta intenso', 'Antioxidante'],
    propertiesEn: ['Thermal regulator', 'Throat soother', 'Vibrant magenta dye', 'High in anthocyanins'],
    descriptionEs: 'La semilla del pequeño cactus andino de puna. Produce un tinte púrpura-magenta glorioso y una bebida refrescante que calma fiebres internas, desinflama la garganta y revitaliza el organismo.',
    descriptionEn: 'The seed of a high-altitude dwarf Andean cactus. It yields a glorious magenta pigment and a cooling medicinal drink that calms internal fevers, soothes irritated throats, and hydrates the body.',
    traditionalUseEs: 'Agua de tiempo rosada para niños y ancianos durante fiebres; tinte primordial en los telares finos de Chinchero y Patacancha.',
    traditionalUseEn: 'Cooling pink tonic given during fevers; essential natural dye for master weavers in Chinchero and Patacancha.',
    preparationEs: 'Remojar 1 cucharada de semillas en agua tibia durante 20 minutos hasta que el agua adquiera un color rubí intenso.',
    preparationEn: 'Soak 1 tablespoon of seeds in lukewarm water for 20 minutes until a vivid ruby elixir emerges.',
    sumaqPracticeEs: 'Servimos una bebida ceremonial de Ayrampo helada con jugo de limón fresco y muña como bienvenida a nuestro espacio en Chillca.',
    sumaqPracticeEn: 'We serve a refreshing welcome elixir of chilled Ayrampo, fresh valley citrus, and muña at our Chillca center.',
    tagColor: '#9333ea'
  },
  {
    id: 'chuchuhuasi',
    name: 'Chuchuhuasi',
    quechuaName: 'Chuchuhuasi / Maytenus macrocarpa',
    scientificName: 'Maytenus macrocarpa',
    category: 'energetica',
    categoryLabelEs: 'Vigorizante & Articulaciones',
    categoryLabelEn: 'Vigorizing & Joint Restorative',
    propertiesEs: ['Fortalece el sistema inmune', 'Reconstituyente físico', 'Antirreumático', 'Afrodisíaco andino-amazónico'],
    propertiesEn: ['Immune booster', 'Physical restorative', 'Anti-rheumatic', 'Amazon-Andes tonic'],
    descriptionEs: 'Corteza sagrada que une la ceja de selva de Cusco con los Andes. Su nombre en quechua significa "espalda temblorosa", haciendo referencia a su capacidad milagrosa para devolver la firmeza y juventud a la columna vertebral.',
    descriptionEn: 'A revered bark bridging Cusco\'s cloud forests with the Andes. Its indigenous name translates to "trembling back", referencing its time-honored power to restore strength and flexibility to the spine and joints.',
    traditionalUseEs: 'Macerado en miel de caña para revitalizar a personas mayores y cazadores en expediciones difíciles.',
    traditionalUseEn: 'Macerated in raw sugarcane honey to revitalize elders and trackers on demanding journeys.',
    preparationEs: 'Decocción lenta de la corteza durante 20 minutos; se toma media taza tibia por las mañanas.',
    preparationEn: 'Slow decoction of the dried bark for 20 minutes; taken as a warming half-cup morning tonic.',
    sumaqPracticeEs: 'Incluido en nuestro taller de preparación de elixires reconstituyentes para viajeros que afrontan caminatas de varios días.',
    sumaqPracticeEn: 'Featured in our restorative elixir workshops for travelers preparing for multi-day expeditions.',
    tagColor: '#b45309'
  }
];
