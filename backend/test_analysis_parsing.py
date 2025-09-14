#!/usr/bin/env python3

import json

def test_analysis_parsing():
    """Test the dance analysis parsing logic"""
    
    # Your provided analysis data
    sample_analysis = {
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
            },
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
            },
            {
                "timestamp_of_outcome": "0:06.0",
                "result": "reference",
                "move_type": "Upper body Movement",
                "feedback": "Upper body is smooth and natural to the beat."
            },
            {
                "timestamp_of_outcome": "0:06.0",
                "result": "recording",
                "move_type": "Upper body Movement",
                "feedback": "Upper body needs to move more naturally. Just feel the beat."
            }
        ]
    }

    def parse_timestamp(timestamp):
        if ':' in timestamp:
            minutes, seconds = timestamp.split(':')
            return float(minutes) * 60 + float(seconds)
        else:
            return float(timestamp)

    def timestamp_to_frame(timestamp, fps):
        seconds = parse_timestamp(timestamp)
        return int(seconds * fps)

    # Simulate the processing logic
    process_fps = 30  # Assume 30 FPS
    
    print("=== Testing Analysis Data Processing ===")
    print(f"Input structure keys: {list(sample_analysis.keys())}")
    print(f"Number of dance_analysis items: {len(sample_analysis['dance_analysis'])}")
    print()

    # Process the data like the updated code does
    analysis_items = []
    if 'performance_comparison' in sample_analysis:
        analysis_items = sample_analysis['performance_comparison']
        print("Using 'performance_comparison' structure")
    elif 'dance_analysis' in sample_analysis:
        analysis_items = sample_analysis['dance_analysis']
        print("Using 'dance_analysis' structure")

    print(f"Found {len(analysis_items)} analysis items to process")
    print()

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

    print("=== Grouped by Timestamp ===")
    for timestamp, group in timestamp_groups.items():
        print(f"Timestamp: {timestamp}")
        print(f"  Move Type: {group['move_type']}")
        print(f"  Score: {group['score']}")
        print(f"  Reference: {group['reference_feedback']}")
        print(f"  Recording: {group['recording_feedback']}")
        print()

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

    print("=== Final Dance Events ===")
    for i, event in enumerate(dance_events):
        print(f"Event {i+1}:")
        print(f"  Frame: {event['frame_number']} (ends at {event['feedback_end_frame']})")
        print(f"  Move: {event['move_type']}")
        print(f"  Score: {event['score']}")
        print(f"  Feedback: {event['feedback'][:80]}{'...' if len(event['feedback']) > 80 else ''}")
        print()

    return dance_events

if __name__ == "__main__":
    dance_events = test_analysis_parsing()
    print(f"Successfully created {len(dance_events)} dance events for video annotation!")
