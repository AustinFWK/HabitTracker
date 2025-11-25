from anthropic import Anthropic
import os

class AIService:
    def __init__(self):
        self.client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    def generate_feedback(self, entry: str, mood_scale: int) -> str:
            """
          Generate personalized habit suggestions based on entry and mood.
          
          Args:
              entry: User's journal entry text
              mood_scale: Integer 1-5 (1=Very Bad, 5=Very Good)
          
          Returns:
              AI-generated feedback as a string
            """
            mood_descriptions = {
                1: "very bad",
                2: "bad",
                3: "neutral",
                4: "good",
                5: "very good"
            }

            #mapped mood rating to text so model has an easier time understanding the context
            mood_text = mood_descriptions.get(mood_scale, "neutral")

            prompt = f"""You are a supportive life coach analyzing someone's daily check-in.

                Their mood today: {mood_text} ({mood_scale}/5)
                Their entry: "{entry}"

                Based on their entry and mood, provide 2-3 specific, actionable habit suggestions to improve their life. 
                Your feedback should be:
                - Personalized to what they wrote
                - Encouraging and constructive (even if they feel good, suggest ways to maintain or build on it)
                - Focused on small, achievable changes
                - Warm and supportive in tone

                Keep your response under 150 words."""
            
             # Call Claude API
            message = self.client.messages.create(
                model="claude-sonnet-4-5-20250929",
                max_tokens=300,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract the text response
            return message.content[0].text
