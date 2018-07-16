import sys
from Compatibility import *


def main():
    if (len(sys.argv) == 1):
        print("No Datas")
        
    else:
        JsonInput = sys.argv[1]
        
        Nodes = JsonToNodes(JsonInput)
        G = Graph("Graph")
        G.nodes = Nodes
        Hamilton = pathfinder(G)
        
        JsonOutput = NodesToJson(Hamilton)
        return(JsonOutput)
        

main()