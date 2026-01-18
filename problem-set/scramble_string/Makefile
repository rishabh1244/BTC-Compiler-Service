CXX = g++
CXXFLAGS = -O2 -std=c++17

all: 

	$(CXX) $(CXXFLAGS) code/solve.cpp -o solve_binary
	chmod +x solve_binary
	$(CXX) $(CXXFLAGS) test/test.cpp -o test_binary
	./test_binary
	rm -f solve_binary test_binary
 	
