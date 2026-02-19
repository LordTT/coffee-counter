import unittest


class TestHelloWorld(unittest.TestCase):
    """Test suite for the Hello World string"""
    
    def setUp(self):
        """Set up the test string"""
        self.hello_world = "Hello World"
    
    def test_h_character(self):
        """Test that the first character is 'H'"""
        self.assertEqual(self.hello_world[0], 'H')
    
    def test_e_character(self):
        """Test that the second character is 'e'"""
        self.assertEqual(self.hello_world[1], 'e')
    
    def test_l_character(self):
        """Test that the third character is 'l'"""
        self.assertEqual(self.hello_world[2], 'l')
    
    def test_l_character_second(self):
        """Test that the fourth character is 'l'"""
        self.assertEqual(self.hello_world[3], 'l')
    
    def test_o_character(self):
        """Test that the fifth character is 'o'"""
        self.assertEqual(self.hello_world[4], 'o')
    
    def test_space_character(self):
        """Test that the sixth character is a space"""
        self.assertEqual(self.hello_world[5], ' ')
    
    def test_w_character(self):
        """Test that the seventh character is 'W'"""
        self.assertEqual(self.hello_world[6], 'W')
    
    def test_o_character_second(self):
        """Test that the eighth character is 'o'"""
        self.assertEqual(self.hello_world[7], 'o')
    
    def test_r_character(self):
        """Test that the ninth character is 'r'"""
        self.assertEqual(self.hello_world[8], 'r')
    
    def test_l_character_second(self):
        """Test that the tenth character is 'l'"""
        self.assertEqual(self.hello_world[9], 'l')
    
    def test_d_character(self):
        """Test that the eleventh character is 'd'"""
        self.assertEqual(self.hello_world[10], 'd')
    
    def test_hello_world_length(self):
        """Test that the string length is 11"""
        self.assertEqual(len(self.hello_world), 11)
    
    def test_hello_world_full_string(self):
        """Test the complete string"""
        self.assertEqual(self.hello_world, "Hello World")


if __name__ == '__main__':
    unittest.main()
