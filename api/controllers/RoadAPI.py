import sys
import json
from itertools import *
from math import *

## From GraphO

class Node :
    def __init__(self, ID, name, position) :
        self.ID = ID #ID chosen to simplify manipulations
        self.name = name #name given by the user
        self.position = position #2-element list that represent latitude and longitude
        self.neighbors = [] #ID tab only used for Christofides. Unneeded in the others cases because the euclidian distance between two points always exists

class Graph :
    def __init__(self, name) : 
        self.name = name
        self.nodes = [] #list of nodes
        self.hamilton = [] #hamilton path 
    
    def distNodes(self,ID1,ID2,latlong = True) :
        """returns the distance between two nodes in meters"""
        if ID1 == ID2:
            return 0

        def distMeter(lat1, long1, lat2, long2):
            p = 0.017453292519943295     #Pi/180
            a = 0.5 - cos((lat2 - lat1) * p)/2 + cos(lat1 * p) * cos(lat2 * p) * (1 - cos((long2 - long1) * p)) / 2
            return 12742000 * asin(sqrt(a))

        node1 = self.nodes[ID1]
        node2 = self.nodes[ID2]
        
        if (latlong):
            lat1 = node1.position[0]
            long1 = node1.position[1]
            
            lat2 = node2.position[0]
            long2 = node2.position[1]
            return distMeter(lat1, long1, lat2, long2)
        
        def DistEucl(pos1,pos2):
            return sqrt((pos1[0]-pos2[0])**2 + (pos1[1]-pos2[1])**2)
            
        return DistEucl(node1.position, node2.position)




## From HamiltonO

def Brutal(G, latlong = True):
    """return the hamilton path and it's cost by comparing EVERY possibilities"""
    n =  len(G.nodes)
    MinPath = G.nodes
    MinCost = 0
    for k in range (n-1):
        MinCost += G.distNodes(G.nodes[k].ID, G.nodes[k+1].ID, latlong)
        if (k == n-2):
            MinCost += G.distNodes(G.nodes[k+1].ID, G.nodes[0].ID, latlong)
            
    for path in list(permutations(G.nodes)):
        cost = 0
        k = 0
        test = True
        while (k<n-1) and (test):
            cost += G.distNodes(path[k].ID, path[k+1].ID, latlong)
            if (k == n-2):
                cost += G.distNodes(path[k+1].ID, path[0].ID, latlong)
            if (cost > MinCost):
                test = False
            k += 1
        if (cost < MinCost):
            MinCost = cost
            MinPath = list(path)
        
    return [MinCost, MinPath]
    
    
def Inser(G, latlong = True):
    """return an aproximated path that has been constructed by insertion of nodes"""
    stack = G.nodes.copy()
    shuffle(stack)
    n =  len(G.nodes)
    if (n < 2):
        return [0, G.nodes]
    if (n == 2):
        return [2 * G.distNodes(G.nodes[0].ID, G.nodes[1].ID, latlong), G.nodes]
    path = [stack.pop(),stack.pop()]
    while (stack):
        node = stack.pop()
        m = len(path)
        indexInser = m
        MinDetour = G.distNodes(path[-1].ID, node.ID, latlong) + G.distNodes(node.ID, path[0].ID, latlong) - G.distNodes(path[-1].ID, path[0].ID, latlong)
        for k in range (m-1):
            detour = G.distNodes(path[k].ID, node.ID, latlong) + G.distNodes(node.ID, path[k+1].ID, latlong) - G.distNodes(path[k].ID, path[k+1].ID, latlong)
            if (detour < MinDetour):
                MinDetour = detour
                indexInser = k + 1
        path.insert(indexInser,node)
        
    cost = 0
    for k in range (n-1):
        cost += G.distNodes(path[k].ID, path[k+1].ID, latlong)
        if (k == n-2):
            cost += G.distNodes(path[k+1].ID, path[0].ID, latlong)
            
    return [cost, path]
    
    

def Nearest(G, latlong = True):
    """return an aproximated path that has been constructed by adding the nearest neighbor at each step"""
    list = G.nodes.copy()
    shuffle(list)
    n =  len(G.nodes)
    cost = 0
    if (n < 2):
        return [0, G.nodes]
    if (n == 2):
        return [2 * G.distNodes(G.nodes[0].ID, G.nodes[1].ID, latlong), G.nodes]
    
    path = [list.pop()]
    while (list):
        m = len(list)
        Nearest = 0
        MinDist = G.distNodes(path[-1].ID, list[0].ID, latlong)
        for k in range (m):
            dist = G.distNodes(path[-1].ID, list[k].ID, latlong)
            if (dist < MinDist):
                MinDist = dist
                Nearest = k
        path.append(list.pop(Nearest))
        cost += MinDist
    cost += G.distNodes(path[-1].ID, path[0].ID, latlong)
    
    return [cost, path]

    

def H2opt(G, Hamilton, latlong = True):
    def Swap2opt(path, k, l):
        if (l == 0):
            middle = path[k+2 :]
            middle.reverse()
            path = path[k+1] + path[1 : k+1] + path[0] + middle
            return path
        middle = path[k+1 : l+1]
        middle.reverse()
        path = path[: k+1] + middle + path[l+1 :]
        return path
        
    n = len(Hamilton)
    z = 0
    comp = 0
    limit = 100
    better = True
    while (better) and (z < limit):
        z += 1
        better = False
        for i in range (n):
            for j in range(n):
                if (j < i-1) or (j > i+1):
                    k = min(i, j)
                    l = max(i, j)
                    
                    a = k
                    b = k+1
                    c = l
                    d = l+1
                    if (l == n-1):
                        d = 0

                    if (G.distNodes(Hamilton[a].ID, Hamilton[b].ID , latlong) + G.distNodes(Hamilton[c].ID, Hamilton[d].ID , latlong) > G.distNodes(Hamilton[a].ID, Hamilton[c].ID , latlong) + G.distNodes(Hamilton[b].ID, Hamilton[d].ID , latlong)):
                        Hamilton = Swap2opt(Hamilton, k, l)
                        better = True
                        comp +=1
                        
    cost = 0
    for k in range (n-1):
        cost += G.distNodes(Hamilton[k].ID, Hamilton[k+1].ID, latlong)
        if (k == n-2):
            cost += G.distNodes(Hamilton[k+1].ID, Hamilton[0].ID, latlong)
            
    return [cost, Hamilton]
    
    


## From CompatibilityO

def pathfinder(G, latlong=True):
    n = len(G.nodes)
    if (n < 7):
        return Brutal(G, latlong)[1]
    else:
        return H2opt(G, Inser(G, latlong), latlong)[1]


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
    
    
    
    
## From MainO

def main():
    if (len(sys.argv) == 1):
        print("No Datas")
        
    else:
        JsonInput = sys.argv[1]
        
        JsonInput = JsonInput.replace('name','"name"')
        JsonInput = JsonInput.replace('latitude','"latitude"')
        JsonInput = JsonInput.replace('longitude','"longitude"')
        
        Nodes = JsonToNodes(JsonInput)
        G = Graph("Graph")
        G.nodes = Nodes
        Hamilton = pathfinder(G)
        
        JsonOutput = NodesToJson(Hamilton)
        print(JsonOutput)
        

main()