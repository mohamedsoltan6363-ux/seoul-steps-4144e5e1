import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not set');
    }

    const { message, conversationHistory = [] } = await req.json();

    const systemPrompt = `أنت معلم لغة كورية محترف ومتحمس. مهمتك هي:
1. مساعدة الطلاب في تعلم اللغة الكورية
2. تصحيح أخطائهم بلطف وتقديم التوضيحات
3. تقديم أمثلة وجمل للممارسة
4. شرح القواعد النحوية الكورية
5. تعليم المفردات الجديدة مع النطق

قواعد مهمة:
- اكتب الكلمات الكورية مع النطق بالحروف العربية والإنجليزية
- قدم تصحيحات مفصلة للأخطاء
- شجع الطالب واحتفِ بتقدمه
- استخدم الإيموجي لجعل المحادثة ممتعة
- إذا كتب الطالب بالكورية، صحح أخطاءه واشرح الصواب

مثال على التصحيح:
❌ الجملة الخاطئة
✅ الجملة الصحيحة
📝 الشرح: ...`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message }
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("AI Gateway error:", error);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || "عذراً، لم أستطع الرد. حاول مرة أخرى.";

    return new Response(JSON.stringify({ 
      message: aiMessage,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
