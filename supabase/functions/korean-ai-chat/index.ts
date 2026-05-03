import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let userId: string | null = null;

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: 'يجب تسجيل الدخول لاستخدام المحادثة',
        success: false,
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({
        error: 'يجب تسجيل الدخول لاستخدام المحادثة',
        success: false,
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    userId = user.id;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('Configuration error: LOVABLE_API_KEY missing');
      return new Response(JSON.stringify({
        error: 'الخدمة غير متاحة حالياً',
        success: false,
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const message = typeof body?.message === 'string' ? body.message.slice(0, 4000) : '';
    const conversationHistory = Array.isArray(body?.conversationHistory)
      ? body.conversationHistory.slice(-20)
      : [];

    if (!message.trim()) {
      return new Response(JSON.stringify({
        error: 'الرسالة فارغة',
        success: false,
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
      { role: "user", content: message },
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
      const errText = await response.text().catch(() => '');
      console.error("AI Gateway error:", { status: response.status, userId, errText });
      if (response.status === 429) {
        return new Response(JSON.stringify({
          error: 'تم تجاوز الحد المسموح. حاول لاحقاً',
          success: false,
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({
        error: 'الخدمة غير متاحة مؤقتاً. يرجى المحاولة مرة أخرى',
        success: false,
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || "عذراً، لم أستطع الرد. حاول مرة أخرى.";

    return new Response(JSON.stringify({
      message: aiMessage,
      success: true,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Chat function error:", {
      error: error instanceof Error ? error.message : 'Unknown',
      userId,
      timestamp: new Date().toISOString(),
    });
    return new Response(JSON.stringify({
      error: 'حدث خطأ. يرجى المحاولة مرة أخرى',
      success: false,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
