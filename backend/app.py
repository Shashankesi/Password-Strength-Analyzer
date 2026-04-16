"""
Password Strength Analyzer - Flask Backend
Premium cybersecurity dashboard API
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import math
import re
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# In-memory storage for password history (ideally use a database in production)
password_history = []


class PasswordAnalyzer:
    """Core password analysis engine with entropy calculation and crack time estimation"""
    
    # Charset sizes (matching Python project logic)
    CHARSET_SIZES = {
        'lowercase': 26,
        'uppercase': 26,
        'digits': 10,
        'special': 32  # Common special characters
    }
    
    # Strength thresholds (entropy-based)
    STRENGTH_THRESHOLDS = {
        'weak': (0, 28),
        'moderate': (28, 50),
        'strong': (50, 80),
        'very_strong': (80, float('inf'))
    }
    
    # Crack time attempts per second (1 million attempts/sec assumed)
    ATTEMPTS_PER_SECOND = 1e6
    
    @staticmethod
    def detect_charset(password):
        """Detect which character sets are used in the password"""
        charset_info = {
            'has_lowercase': bool(re.search(r'[a-z]', password)),
            'has_uppercase': bool(re.search(r'[A-Z]', password)),
            'has_digits': bool(re.search(r'\d', password)),
            'has_special': bool(re.search(r'[!@#$%^&*()_+\-=\[\]{};:\'",.<>?/\\|`~]', password))
        }
        return charset_info
    
    @staticmethod
    def calculate_charset_size(password_metadata):
        """Calculate total charset size based on detected character types"""
        charset_size = 0
        if password_metadata['has_lowercase']:
            charset_size += PasswordAnalyzer.CHARSET_SIZES['lowercase']
        if password_metadata['has_uppercase']:
            charset_size += PasswordAnalyzer.CHARSET_SIZES['uppercase']
        if password_metadata['has_digits']:
            charset_size += PasswordAnalyzer.CHARSET_SIZES['digits']
        if password_metadata['has_special']:
            charset_size += PasswordAnalyzer.CHARSET_SIZES['special']
        
        return charset_size if charset_size > 0 else 1
    
    @staticmethod
    def calculate_entropy(password, charset_size):
        """
        Calculate entropy using Shannon entropy formula
        entropy = length × log2(charset_size)
        
        This represents the "bits of security" in the password
        """
        if charset_size <= 1:
            return 0
        
        entropy = len(password) * math.log2(charset_size)
        return round(entropy, 2)
    
    @staticmethod
    def calculate_combinations(password_length, charset_size):
        """Calculate total possible combinations"""
        if charset_size <= 1:
            return 0
        return charset_size ** password_length
    
    @staticmethod
    def estimate_crack_time(combinations):
        """
        Estimate time to crack password
        Assumes attacker can try 1 million passwords per second
        Returns time in multiple units for clarity
        """
        if combinations == 0:
            return {
                'seconds': 0,
                'minutes': 0,
                'hours': 0,
                'days': 0,
                'years': 0,
                'display': '< 1 second'
            }
        
        # Average time is half of total combinations
        average_seconds = (combinations / 2) / PasswordAnalyzer.ATTEMPTS_PER_SECOND
        
        # Calculate different time units
        minutes = average_seconds / 60
        hours = minutes / 60
        days = hours / 24
        years = days / 365.25
        
        crack_time = {
            'seconds': round(average_seconds, 2),
            'minutes': round(minutes, 2),
            'hours': round(hours, 2),
            'days': round(days, 2),
            'years': round(years, 2),
            'display': PasswordAnalyzer._format_crack_time(years, days, hours, minutes, average_seconds)
        }
        
        return crack_time
    
    @staticmethod
    def _format_crack_time(years, days, hours, minutes, seconds):
        """Format crack time in human-readable format"""
        if years >= 1000:
            return f"{years:,.0f} years"
        elif years >= 1:
            return f"{years:.2f} years"
        elif days >= 1:
            return f"{days:.2f} days"
        elif hours >= 1:
            return f"{hours:.2f} hours"
        elif minutes >= 1:
            return f"{minutes:.2f} minutes"
        elif seconds >= 1:
            return f"{seconds:.2f} seconds"
        else:
            return "< 1 second"
    
    @staticmethod
    def classify_strength(entropy):
        """Classify password strength based on entropy"""
        for strength, (min_val, max_val) in PasswordAnalyzer.STRENGTH_THRESHOLDS.items():
            if min_val <= entropy < max_val:
                return strength
        return 'very_strong'
    
    @staticmethod
    def get_strength_color(entropy):
        """Get color representation for strength"""
        strength = PasswordAnalyzer.classify_strength(entropy)
        colors = {
            'weak': '#ff4757',           # Red
            'moderate': '#ffa502',       # Orange
            'strong': '#1e90ff',         # Blue
            'very_strong': '#2ed573'    # Green
        }
        return colors.get(strength, '#ffffff')
    
    @staticmethod
    def generate_recommendations(password, charset_info):
        """Generate actionable recommendations to improve password strength"""
        recommendations = []
        
        # Missing character types
        if not charset_info['has_lowercase']:
            recommendations.append({
                'type': 'missing_lowercase',
                'icon': 'a-z',
                'text': 'Add lowercase letters (a-z)',
                'priority': 'high'
            })
        
        if not charset_info['has_uppercase']:
            recommendations.append({
                'type': 'missing_uppercase',
                'icon': 'A-Z',
                'text': 'Add uppercase letters (A-Z)',
                'priority': 'high'
            })
        
        if not charset_info['has_digits']:
            recommendations.append({
                'type': 'missing_digits',
                'icon': '0-9',
                'text': 'Add numbers (0-9)',
                'priority': 'medium'
            })
        
        if not charset_info['has_special']:
            recommendations.append({
                'type': 'missing_special',
                'icon': '!@#',
                'text': 'Add special characters (!@#$%...)',
                'priority': 'medium'
            })
        
        # Length suggestions
        if len(password) < 12:
            recommendations.append({
                'type': 'increase_length',
                'icon': '↑',
                'text': f'Increase length to at least 12 (currently {len(password)})',
                'priority': 'high'
            })
        elif len(password) < 16:
            recommendations.append({
                'type': 'increase_length',
                'icon': '↑',
                'text': f'Consider increasing to 16+ characters (currently {len(password)})',
                'priority': 'low'
            })
        
        # Excellent password feedback
        if not recommendations:
            recommendations.append({
                'type': 'excellent',
                'icon': '✓',
                'text': 'Excellent password! Strong character mix and length.',
                'priority': 'info'
            })
        
        return recommendations
    
    @staticmethod
    def generate_graph_data(password, charset_info):
        """Generate data for visualization graphs"""
        password_length = len(password)
        charset_size = PasswordAnalyzer.calculate_charset_size(charset_info)
        
        # Graph 1: Length vs Combinations (logarithmic scale)
        length_data = []
        for length in range(1, max(password_length + 5, 20)):
            combinations = charset_size ** length
            log_combinations = math.log10(combinations) if combinations > 0 else 0
            length_data.append({
                'length': length,
                'combinations': combinations,
                'log_combinations': log_combinations,
                'is_current': length == password_length
            })
        
        # Graph 2: Crack time comparison for different character sets
        crack_time_comparison = []
        test_length = password_length if password_length >= 8 else 8
        
        # Different character set combinations
        scenarios = [
            {'name': 'Digits Only', 'size': 10, 'color': '#ff4757'},
            {'name': 'Lowercase', 'size': 26, 'color': '#ffa502'},
            {'name': 'Alphanumeric', 'size': 62, 'color': '#1e90ff'},
            {'name': 'All Characters', 'size': 94, 'color': '#2ed573'},
            {'name': 'Your Password', 'size': charset_size, 'color': '#ff006e', 'is_current': True}
        ]
        
        for scenario in scenarios:
            combinations = scenario['size'] ** test_length
            crack_time = PasswordAnalyzer.estimate_crack_time(combinations)
            
            # Convert to years for comparison (or readable format)
            years = crack_time['years']
            
            crack_time_comparison.append({
                'name': scenario['name'],
                'length': test_length,
                'charset_size': scenario['size'],
                'years': years,
                'display': crack_time['display'],
                'color': scenario['color'],
                'is_current': scenario.get('is_current', False)
            })
        
        return {
            'length_vs_combinations': length_data,
            'crack_time_comparison': crack_time_comparison
        }
    
    @staticmethod
    def analyze(password):
        """Complete password analysis"""
        if not password:
            return {'error': 'Password cannot be empty'}
        
        # Detection
        charset_info = PasswordAnalyzer.detect_charset(password)
        charset_size = PasswordAnalyzer.calculate_charset_size(charset_info)
        
        # Calculations
        entropy = PasswordAnalyzer.calculate_entropy(password, charset_size)
        combinations = PasswordAnalyzer.calculate_combinations(len(password), charset_size)
        crack_time = PasswordAnalyzer.estimate_crack_time(combinations)
        strength = PasswordAnalyzer.classify_strength(entropy)
        color = PasswordAnalyzer.get_strength_color(entropy)
        
        # Recommendations and graphs
        recommendations = PasswordAnalyzer.generate_recommendations(password, charset_info)
        graph_data = PasswordAnalyzer.generate_graph_data(password, charset_info)
        
        return {
            'password_length': len(password),
            'charset_size': charset_size,
            'charset_info': charset_info,
            'entropy': entropy,
            'strength': strength,
            'strength_color': color,
            'combinations': combinations,
            'crack_time': crack_time,
            'recommendations': recommendations,
            'graph_data': graph_data,
            'timestamp': datetime.now().isoformat()
        }


@app.route('/api/analyze', methods=['POST'])
def analyze_password():
    """POST endpoint to analyze password strength"""
    try:
        data = request.get_json()
        
        if not data or 'password' not in data:
            return jsonify({'error': 'Password field is required'}), 400
        
        password = data.get('password', '')
        
        if not password:
            return jsonify({'error': 'Password cannot be empty'}), 400
        
        # Analyze password
        result = PasswordAnalyzer.analyze(password)
        
        if 'error' in result:
            return jsonify(result), 400
        
        # Store in history (don't store actual password for security)
        history_entry = {
            'id': len(password_history) + 1,
            'length': result['password_length'],
            'entropy': result['entropy'],
            'strength': result['strength'],
            'crack_time_display': result['crack_time']['display'],
            'timestamp': result['timestamp']
        }
        password_history.append(history_entry)
        
        # Keep only last 50 entries
        if len(password_history) > 50:
            password_history.pop(0)
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/history', methods=['GET'])
def get_history():
    """GET endpoint to retrieve password analysis history"""
    return jsonify({
        'history': password_history,
        'count': len(password_history)
    }), 200


@app.route('/api/history', methods=['DELETE'])
def clear_history():
    """DELETE endpoint to clear password analysis history"""
    global password_history
    password_history = []
    return jsonify({'message': 'History cleared'}), 200


@app.route('/api/generate-password', methods=['POST'])
def generate_strong_password():
    """POST endpoint to generate a strong password suggestion"""
    import random
    import string
    
    try:
        data = request.get_json()
        length = data.get('length', 16) if data else 16
        
        # Ensure minimum length
        if length < 8:
            length = 8
        if length > 64:
            length = 64
        
        # Generate password with all character types
        lowercase = string.ascii_lowercase
        uppercase = string.ascii_uppercase
        digits = string.digits
        special = "!@#$%^&*()_+-=[]{}|;:,.<>?~"
        
        # Ensure at least one of each type
        password_chars = [
            random.choice(lowercase),
            random.choice(uppercase),
            random.choice(digits),
            random.choice(special)
        ]
        
        # Fill the rest randomly
        all_chars = lowercase + uppercase + digits + special
        for _ in range(length - 4):
            password_chars.append(random.choice(all_chars))
        
        # Shuffle to avoid predictable pattern
        random.shuffle(password_chars)
        password = ''.join(password_chars)
        
        # Analyze the generated password
        result = PasswordAnalyzer.analyze(password)
        result['generated_password'] = password
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'Password Strength Analyzer'}), 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
