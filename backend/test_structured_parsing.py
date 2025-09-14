#!/usr/bin/env python3

import json

def test_new_parsing_logic():
    """Test the new parsing logic with different data formats"""
    
    # Test case 1: Direct dance_analysis format (your original)
    sample_1 = {
        "dance_analysis": [
            {
                "timestamp_of_outcome": "0:01.0",
                "result": "reference",
                "move_type": "Arm Movement",
                "feedback": "The arm movement is smooth and expressive, matching the beat of the music well."
            },
            {
                "timestamp_of_outcome": "0:01.0",
                "result": "recording",
                "move_type": "Arm Movement",
                "feedback": "The arm movement is slightly stiff. Loosen up and try to feel the rhythm more."
            }
        ]
    }
    
    # Test case 2: New structured format with parsed_data
    sample_2 = {
        "response": '{"dance_analysis": [...]}',
        "parsed_data": {
            "dance_analysis": [
                {
                    "timestamp_of_outcome": "0:03.0",
                    "result": "reference",
                    "move_type": "Hip sway",
                    "feedback": "Smooth and controlled hip sway that complements the arm movements."
                },
                {
                    "timestamp_of_outcome": "0:03.0",
                    "result": "recording",
                    "move_type": "Hip sway",
                    "feedback": "Hip sway is present but needs more definition. Focus on isolating the movement."
                }
            ]
        }
    }
    
    def parse_analysis_data(dance_analysis_str):
        """Simulate the new parsing logic"""
        analysis_data = None
        
        try:
            parsed_json = json.loads(dance_analysis_str)
            print("Successfully parsed JSON directly")
            
            # Check if it's the new format with parsed_data
            if 'parsed_data' in parsed_json and 'dance_analysis' in parsed_json['parsed_data']:
                analysis_data = parsed_json['parsed_data']
                print("Using structured output data from parsed_data")
            elif 'dance_analysis' in parsed_json:
                analysis_data = parsed_json
                print("Using dance_analysis from direct JSON")
            elif 'response' in parsed_json:
                # Try to parse the response field as JSON
                try:
                    response_data = json.loads(parsed_json['response'])
                    if 'dance_analysis' in response_data:
                        analysis_data = response_data
                        print("Using dance_analysis from response field")
                except:
                    pass
            
            if not analysis_data:
                # Fallback to treating the whole thing as analysis data
                analysis_data = parsed_json
                print("Using entire JSON as analysis data")
                
        except json.JSONDecodeError as e:
            print(f"JSON parsing failed: {e}")
            return None
            
        return analysis_data
    
    def process_dance_events(analysis_data):
        """Convert to dance events format"""
        def parse_timestamp(timestamp):
            if ':' in timestamp:
                minutes, seconds = timestamp.split(':')
                return float(minutes) * 60 + float(seconds)
            else:
                return float(timestamp)

        def timestamp_to_frame(timestamp, fps):
            seconds = parse_timestamp(timestamp)
            return int(seconds * fps)
        
        process_fps = 30
        
        # Handle different JSON structures from Gemini analysis
        analysis_items = []
        if 'performance_comparison' in analysis_data:
            analysis_items = analysis_data['performance_comparison']
            print("Using 'performance_comparison' structure")
        elif 'dance_analysis' in analysis_data:
            analysis_items = analysis_data['dance_analysis']
            print("Using 'dance_analysis' structure")
            
        print(f"Found {len(analysis_items)} analysis items to process")
        
        # Group by timestamp and combine reference/recording feedback
        timestamp_groups = {}
        for item in analysis_items:
            timestamp = item.get('timestamp_of_outcome', item.get('timestamp', '0:00.0'))
            if timestamp not in timestamp_groups:
                timestamp_groups[timestamp] = {
                    'timestamp': timestamp,
                    'move_type': item.get('move_type', 'Dance Move'),
                    'reference_feedback': '',
                    'recording_feedback': '',
                    'score': 75  # Default score
                }
            
            # Assign feedback based on result type
            result_type = item.get('result', 'recording')
            feedback = item.get('feedback', item.get('improvement_suggestions', ''))
            
            if result_type == 'reference':
                timestamp_groups[timestamp]['reference_feedback'] = feedback
            elif result_type == 'recording':
                timestamp_groups[timestamp]['recording_feedback'] = feedback
                # Try to derive a score from the feedback (simple heuristic)
                if any(word in feedback.lower() for word in ['good', 'great', 'excellent', 'smooth', 'nice']):
                    timestamp_groups[timestamp]['score'] = 85
                elif any(word in feedback.lower() for word in ['needs', 'stiff', 'improve', 'focus']):
                    timestamp_groups[timestamp]['score'] = 60
                else:
                    timestamp_groups[timestamp]['score'] = 75
        
        # Convert to dance_events format
        dance_events = []
        for timestamp, group in timestamp_groups.items():
            # Combine feedback from both reference and recording
            combined_feedback = group['recording_feedback']
            if group['reference_feedback']:
                combined_feedback = f"Reference: {group['reference_feedback']} | Your performance: {combined_feedback}"
            
            dance_events.append({
                'frame_number': timestamp_to_frame(timestamp, process_fps),
                'move_type': group['move_type'],
                'score': group['score'],
                'feedback': combined_feedback,
                'feedback_end_frame': timestamp_to_frame(timestamp, process_fps) + (4 * process_fps)
            })
        
        return dance_events
    
    print("=== Testing Sample 1 (Direct dance_analysis) ===")
    analysis_1 = parse_analysis_data(json.dumps(sample_1))
    if analysis_1:
        events_1 = process_dance_events(analysis_1)
        print(f"Created {len(events_1)} dance events")
        for event in events_1:
            print(f"  Frame {event['frame_number']}: {event['move_type']} (Score: {event['score']})")
            print(f"    Feedback: {event['feedback'][:60]}...")
    print()
    
    print("=== Testing Sample 2 (Structured with parsed_data) ===")
    analysis_2 = parse_analysis_data(json.dumps(sample_2))
    if analysis_2:
        events_2 = process_dance_events(analysis_2)
        print(f"Created {len(events_2)} dance events")
        for event in events_2:
            print(f"  Frame {event['frame_number']}: {event['move_type']} (Score: {event['score']})")
            print(f"    Feedback: {event['feedback'][:60]}...")
    print()

if __name__ == "__main__":
    test_new_parsing_logic()
