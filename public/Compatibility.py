import json
from Hamilton import *

def pathfinder(G, latlong=True):
    n = len(G.nodes)
    if (n < 7):
        return Brutal(G, latlong)
    else:
        return H2opt(G, Inser(G, latlong), latlong)


def NodesToJson(Nodes):
    inter = []
    n = len(Nodes)
    for k in range(n):
        node = {}
        node["name"] = Nodes[k].name
        node["latitude"] = Nodes[k].position[0]
        node["longitude"] = Nodes[k].position[1]
        inter.append(node)
    Json = json.dumps(inter)
    return Json


def JsonToNodes(Json):
    list = json.loads(Json)
    Nodes = []
    n = len(list)
    for k in range(n):
        node = Node(k, list[k]["name"], [ list[k]["latitude"] , list[k]["longitude"] ])
        Nodes.append(node)
    return Nodes

     

## Tests

if __name__ == '__main__':
    
    def printNodes(Nodes):
        def printNode(Node):
            print("[ ID : " + str(Node.ID) + ", name : " + str(Node.name) + ", position : [ " + str(Node.position[0]) + ", " + str(Node.position[1]) + " ] ]", end='')
        n = len(Nodes)
        print("[", end='')
        for k in range (n):
            printNode(Nodes[k])
            if(k != n-1):
                print(", ", end='')
        print("]", end='')
    
    
    def TestNodesToJson():
        RandGraph = Graph("RandGraph")
        RandGraph.buildRandomGraph(3)
        Json = NodesToJson(RandGraph.nodes)
        print(Json)
        
    
    def TestJsonToNodes():
        RandGraph = Graph("RandGraph")
        RandGraph.buildRandomGraph(3)
        Json = NodesToJson(RandGraph.nodes)
        print(Json)
        Nodes = JsonToNodes(Json)
        printNodes(Nodes)
        
    
    
    def TestsMain():
        #TestNodesToJson()
        TestJsonToNodes()
        
    TestsMain()